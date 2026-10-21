
"use client";

import { analyzeVideoForPerformanceMetrics } from "@/ai/flows/analyze-video-performance-metrics";
import type { AnalyzeVideoForPerformanceMetricsOutput } from "@/ai/flows/analyze-video-performance-metrics";
import { submitPerformanceData } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarChart2, Bot, Camera, CameraOff, Clapperboard, Loader2, Play, AlertTriangle, Send, ShieldCheck, Square, Upload } from "lucide-react";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getBenchmark } from "@/lib/benchmarks";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const setupSchema = z.object({
  assessmentTest: z.enum(["jump-height", "sit-ups", "run-time", "squats", "lunges", "push-ups"]),
  age: z.coerce.number().min(10, "Age must be at least 10").max(40, "Age must be at most 40"),
  gender: z.enum(["male", "female"]),
});

type RecordingState = "idle" | "permission" | "camera_on" | "ready" | "recording" | "recorded" | "analyzing" | "analyzed";

export function VideoAssessment() {
  const { toast } = useToast();
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoSource, setVideoSource] = useState<'record' | 'upload' | null>(null);


  const [analysisResult, setAnalysisResult] = useState<AnalyzeVideoForPerformanceMetricsOutput | null>(null);
  const [benchmarkResult, setBenchmarkResult] = useState<{ value: number; percentile: number } | null>(null);


  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);


  const setupForm = useForm<z.infer<typeof setupSchema>>({
    resolver: zodResolver(setupSchema),
    mode: "onChange",
    defaultValues: {
      age: 18,
    }
  });

  const assessmentTest = setupForm.watch('assessmentTest');
  const age = setupForm.watch('age');
  const gender = setupForm.watch('gender');

  const canProceed = setupForm.formState.isValid;

  const stopCamera = (fromReset = false) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    if (!fromReset) {
      setRecordingState("idle");
      setVideoSource(null);
    }
    setHasCameraPermission(null);
  }

  const requestCameraPermission = async () => {
    if (!canProceed) return;
    setVideoSource('record');
    
    if (stream) {
      setRecordingState("ready");
      return;
    }
    
    setRecordingState("permission");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
        setStream(mediaStream);
        setHasCameraPermission(true);
        setRecordingState("camera_on");
      } catch (error) {
        console.error("Error accessing media devices.", error);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please allow camera access in your browser settings to record video.",
        });
        setHasCameraPermission(false);
        setRecordingState("idle");
        setVideoSource(null);
      }
    } else {
        toast({
          variant: "destructive",
          title: "Camera Not Supported",
          description: "Your browser does not support camera access.",
        });
        setHasCameraPermission(false);
        setRecordingState("idle");
        setVideoSource(null);
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      setRecordingState('ready');
    }
  }, [stream]);

  const startRecording = () => {
    if (stream) {
      recordedChunks.current = [];
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        processVideoBlob(blob);
        stopCamera(true); // Stop camera tracks after recording is finished
      };
      recorder.start();
      setRecordingState("recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoSource('upload');
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        setRecordingTime(Math.round(videoElement.duration));
      };
      videoElement.src = URL.createObjectURL(file);
      processVideoBlob(file);
    }
  };

  const processVideoBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setVideoBlobUrl(url);

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      setVideoDataUri(reader.result as string);
    };
    setRecordingState("recorded");
  };

  const handleAnalyze = async () => {
    if (!videoDataUri || !canProceed) return;
    setRecordingState("analyzing");
    setAnalysisResult(null);
    setBenchmarkResult(null);
    
    try {
        const result = await analyzeVideoForPerformanceMetrics({ 
            videoDataUri, 
            assessmentTest, 
            athleteDetails: `Age: ${age}, Gender: ${gender}` 
        });
        
        setAnalysisResult(result);

        let metricValue: number | undefined = 0;
        if(assessmentTest === 'jump-height') metricValue = result.metrics.jumpHeight;
        if(assessmentTest === 'sit-ups') metricValue = result.metrics.sitUpCount;
        if(assessmentTest === 'run-time') metricValue = result.metrics.runTime;
        if(assessmentTest === 'squats') metricValue = result.metrics.squatCount;
        if(assessmentTest === 'lunges') metricValue = result.metrics.lungeCount;
        if(assessmentTest === 'push-ups') metricValue = result.metrics.pushUpCount;
        
        if (metricValue) {
          setBenchmarkResult(getBenchmark(assessmentTest, age, gender, metricValue));
        } else {
          setBenchmarkResult(null);
        }

        setRecordingState("analyzed");
        toast({
            title: "Analysis Complete",
            description: "Your performance has been analyzed by our AI.",
        });
    } catch(error) {
        console.error("Analysis failed", error);
        toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: "Something went wrong during the analysis. Please try again.",
        });
        setRecordingState("recorded");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const dataToSubmit = {
      ...setupForm.getValues(),
      analysis: analysisResult,
      benchmark: benchmarkResult,
      videoDuration: recordingTime,
    };
    const result = await submitPerformanceData(dataToSubmit);
    if (result.success) {
      toast({
        title: "Submission Successful",
        description: result.message,
      });
      resetState();
    } else {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: result.message,
      });
    }
    setIsSubmitting(false);
  };

  const resetState = () => {
    stopCamera(true);
    setVideoBlobUrl(null);
    setVideoDataUri(null);
    setAnalysisResult(null);
    setBenchmarkResult(null);
    setRecordingTime(0);
    setVideoSource(null);
    setRecordingState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  const renderMetric = () => {
    if (!analysisResult) return <p className="text-muted-foreground">No data</p>;
    
    switch (assessmentTest) {
      case 'jump-height':
        return <p className="text-4xl font-bold">{analysisResult.metrics.jumpHeight?.toFixed(2) ?? 'N/A'}<span className="text-lg font-normal text-muted-foreground"> m</span></p>;
      case 'sit-ups':
        return <p className="text-4xl font-bold">{analysisResult.metrics.sitUpCount ?? 'N/A'}<span className="text-lg font-normal text-muted-foreground"> reps</span></p>;
      case 'run-time':
        return <p className="text-4xl font-bold">{analysisResult.metrics.runTime?.toFixed(2) ?? 'N/A'}<span className="text-lg font-normal text-muted-foreground"> s</span></p>;
      case 'squats':
        return <p className="text-4xl font-bold">{analysisResult.metrics.squatCount ?? 'N/A'}<span className="text-lg font-normal text-muted-foreground"> reps</span></p>;
      case 'lunges':
        return <p className="text-4xl font-bold">{analysisResult.metrics.lungeCount ?? 'N/A'}<span className="text-lg font-normal text-muted-foreground"> reps</span></p>;
      case 'push-ups':
        return <p className="text-4xl font-bold">{analysisResult.metrics.pushUpCount ?? 'N/A'}<span className="text-lg font-normal text-muted-foreground"> reps</span></p>;
      default:
        return <p className="text-muted-foreground">Select a test type</p>;
    }
  };

  const renderBenchmark = () => {
    if (!benchmarkResult) return null;
    const unit = assessmentTest === 'jump-height' ? 'm' : assessmentTest === 'run-time' ? 's' : 'reps';
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart2/> Performance Benchmark</CardTitle>
                <CardDescription>How your performance compares to others in your age and gender group.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">You are in the top</p>
                    <p className="text-5xl font-bold text-primary">{100 - benchmarkResult.percentile}%</p>
                    <p className="text-sm text-muted-foreground">of athletes</p>
                </div>
                <Progress value={100 - benchmarkResult.percentile} className="w-full h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Below Average</span>
                    <span>Average</span>
                    <span>Above Average</span>
                </div>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">Benchmark average for your group: {benchmarkResult.value.toFixed(2)} {unit}</p>
            </CardFooter>
        </Card>
    );
  };

  const renderVideoArea = () => {
    const videoContainerContent = () => {
      if (videoBlobUrl && (recordingState === 'recorded' || recordingState === 'analyzing' || recordingState === 'analyzed')) {
          return <video ref={recordedVideoRef} src={videoBlobUrl} controls className="w-full h-full object-contain" />;
      }
  
      if (videoSource === 'record') {
          if (!canProceed) {
              return (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
                      <p>Please complete Step 1 (Setup Your Test) to enable camera features.</p>
                  </div>
              );
          }
  
          if (stream) {
              return <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />;
          }
  
          if (recordingState === 'permission') {
               return (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <p>Waiting for camera permission...</p>
                  </div>
              );
          }
  
          if (hasCameraPermission === false) {
              return (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
                      <CameraOff className="h-12 w-12 mb-4" />
                      <h3 className="font-semibold text-lg text-foreground mb-1">Camera Access Denied</h3>
                      <p>To record a video, please allow camera access in your browser's settings.</p>
                  </div>
              );
          }
      }
  
      return (
        <div className="text-center text-muted-foreground p-4 flex flex-col items-center justify-center h-full">
            <Clapperboard className="mx-auto h-12 w-12" />
            <p className="font-semibold mt-4">Your video will appear here</p>
            <p className="text-xs mt-1">Record a new video or upload an existing file to get started.</p>
        </div>
      )
    }

    return (
      <div className="relative aspect-video bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
        {videoContainerContent()}
        {recordingState === 'recording' && (
          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span>{formatTime(recordingTime)}</span>
          </div>
        )}
        {(recordingState === 'recorded' || recordingState === 'analyzed') && videoBlobUrl && recordingTime > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
            {formatTime(recordingTime)}
          </div>
        )}
      </div>
    );
  }
  
  const renderControls = () => {
    if (!canProceed) {
        return (
            <p className="text-sm text-muted-foreground text-center">
                Please fill out the setup form to enable video controls.
            </p>
        );
    }

    if (recordingState === 'idle') {
        return (
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button onClick={requestCameraPermission}>
                    <Camera className="mr-2" /> Record Video
                </Button>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                        Or
                        </span>
                    </div>
                </div>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                   <Upload className="mr-2 h-4 w-4"/> Upload File
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden"/>
            </div>
        );
    }
    
    if (videoSource === 'record') {
         return (
          <div className="flex items-center gap-2">
              { recordingState === 'ready' && <Button onClick={startRecording}><Play className="mr-2 h-4 w-4" /> Start Recording</Button> }
              { recordingState === 'recording' && <Button variant="destructive" onClick={stopRecording}><Square className="mr-2 h-4 w-4" /> Stop Recording</Button> }
              { (recordingState === 'recorded' || recordingState === 'analyzed') && <Button variant="outline" onClick={resetState}>Start Over</Button> }
              <Button onClick={() => stopCamera()} variant="ghost" size="icon"><CameraOff /></Button>
          </div>
      )
    }

    if (videoSource === 'upload') {
        return <Button variant="outline" onClick={resetState}>Start Over</Button>
    }

    return null;
  }

  const renderResults = () => {
    if (recordingState === 'analyzing') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
          <p className="font-semibold text-lg">AI is analyzing your video...</p>
          <p>This may take a moment.</p>
        </div>
      );
    }
    
    if (recordingState !== 'analyzed' || !analysisResult) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                <Bot className="h-10 w-10 mb-4" />
                <p>Your analysis results will appear here once you analyze a video.</p>
            </div>
        )
    }

    const { anomalyDetection } = analysisResult;

    return (
      <>
        <div className="grid grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-medium">Your Score</CardTitle>
                </CardHeader>
                <CardContent>
                    {renderMetric()}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-medium">Cheat Detection</CardTitle>
                </CardHeader>
                <CardContent>
                    {anomalyDetection ? (
                        <div className={`flex items-center gap-2 font-bold ${anomalyDetection.anomaliesDetected ? 'text-destructive' : 'text-green-600'}`}>
                            {anomalyDetection.anomaliesDetected ? <AlertTriangle/> : <ShieldCheck/>}
                            {anomalyDetection.anomaliesDetected ? "Anomaly Found" : "Looks Good"}
                        </div>
                    ) : <p className="text-muted-foreground">No data</p>}
                </CardContent>
            </Card>
        </div>
        {anomalyDetection?.anomaliesDetected && (
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Anomaly Detected!</AlertTitle>
                <AlertDescription>
                    {anomalyDetection.anomalyDetails} (Confidence: {(anomalyDetection.confidenceScore * 100).toFixed(0)}%)
                </AlertDescription>
            </Alert>
        )}
        {renderBenchmark()}
      </>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Setup Your Test</CardTitle>
            <CardDescription>Select the assessment and provide your details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...setupForm}>
              <form className="space-y-4">
                <FormField
                  control={setupForm.control}
                  name="assessmentTest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Test</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!videoSource}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a test" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="jump-height">Vertical Jump Height</SelectItem>
                          <SelectItem value="sit-ups">Sit-ups (1 minute)</SelectItem>
                          <SelectItem value="run-time">40-yard Dash</SelectItem>
                          <SelectItem value="squats">Squats</SelectItem>
                          <SelectItem value="lunges">Lunges</SelectItem>
                          <SelectItem value="push-ups">Push-ups</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={setupForm.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Your age" {...field} disabled={!!videoSource} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={setupForm.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!videoSource}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>2. Provide Your Performance Video</CardTitle>
            <CardDescription>Record a new video or upload an existing file.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderVideoArea()}
          </CardContent>
          <CardFooter className="flex-col gap-4 pt-4 border-t">
              {renderControls()}
              {(recordingState === 'recorded' || recordingState === 'analyzed') && videoDataUri &&
                <Button onClick={handleAnalyze} disabled={recordingState === 'analyzing' || !canProceed}>
                    {recordingState === 'analyzing' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    {recordingState === 'analyzed' ? 'Re-analyze' : 'Analyze Performance'}
                </Button>
            }
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className={(recordingState !== 'analyzed' && recordingState !== 'analyzing') ? 'bg-muted/50' : ''}>
          <CardHeader>
            <CardTitle>3. Review Your Results</CardTitle>
            <CardDescription>AI-generated metrics from your video.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 min-h-[400px]">
             {renderResults()}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSubmit} disabled={recordingState !== 'analyzed' || isSubmitting || (analysisResult?.anomalyDetection.anomaliesDetected || false)}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
              {isSubmitting ? 'Submitting...' : 'Submit to SAI'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
