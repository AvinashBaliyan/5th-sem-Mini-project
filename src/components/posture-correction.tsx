'use client';

import { correctPosture } from '@/ai/flows/correct-posture';
import type { CorrectPostureOutput } from '@/ai/flows/correct-posture';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Camera,
  CameraOff,
  CheckCircle2,
  Loader2,
  PersonStanding,
  AlertCircle,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import Image from 'next/image';

const exercises = [
    { value: 'squat', label: 'Squat' },
    { value: 'push-up', label: 'Push-up' },
    { value: 'plank', label: 'Plank' },
    { value: 'lunge', label: 'Lunge' },
    { value: 'bicep-curl', label: 'Bicep Curl' },
    { value: 'overhead-press', label: 'Overhead Press' },
    { value: 'burpee', label: 'Burpee' },
    { value: 'jumping-jack', label: 'Jumping Jack' },
    { value: 'deadlift', label: 'Deadlift' },
] as const;

const exerciseValues = exercises.map(e => e.value) as [string, ...string[]];

const setupSchema = z.object({
  exercise: z.enum(exerciseValues),
});

type AnalysisState = 'idle' | 'permission' | 'camera_on' | 'analyzing' | 'stopped';
type Keypoint = { x: number; y: number; name: string };

const BODY_SEGMENTS: [string, string][] = [
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
];

export function PostureCorrection() {
  const { toast } = useToast();
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [keypoints, setKeypoints] = useState<Keypoint[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAnalysisTime = useRef(0);

  const setupForm = useForm<z.infer<typeof setupSchema>>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      exercise: 'squat',
    },
  });

  const exercise = setupForm.watch('exercise');
  const canProceed = setupForm.formState.isValid;

  const selectedExerciseData = useMemo(() => exercises.find(e => e.value === exercise), [exercise]);


  const stopCamera = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setAnalysisState('stopped');
    setHasCameraPermission(null);
    setFeedback(null);
    setKeypoints([]);
  };

  const requestCameraPermission = async () => {
    if (stream) {
        startAnalysis();
        return;
    }
    
    setAnalysisState('permission');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
        });
        setStream(mediaStream);
        setHasCameraPermission(true);
        setAnalysisState('camera_on');
      } catch (error) {
        console.error('Error accessing media devices.', error);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description:
            'Please allow camera access in your browser settings to use this feature.',
        });
        setHasCameraPermission(false);
        setAnalysisState('idle');
      }
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        if(analysisState !== 'analyzing') {
            startAnalysis();
        }
      };
    }
  }, [stream, analysisState]);

  useEffect(() => {
    // Stop analysis if exercise changes
    if (analysisState === 'analyzing') {
        stopAnalysis();
        startAnalysis();
    }
  }, [exercise]);

  const startAnalysis = () => {
    if (!videoRef.current || !canProceed) return;
    setAnalysisState('analyzing');
    setFeedback('Starting analysis...');

    const analyzeFrame = async () => {
        if (Date.now() - lastAnalysisTime.current < 3000) { // Limit to 1 frame every 3 seconds
            return;
        }

        if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUri = canvas.toDataURL('image/jpeg');
        lastAnalysisTime.current = Date.now();

        try {
            const result = await correctPosture({ imageDataUri, exercise });
            setFeedback(result.feedback);
            setIsCorrect(result.isCorrect);
            setKeypoints(result.keypoints);
        } catch (error) {
            console.error('Posture analysis failed:', error);
            setFeedback('Could not analyze posture. Please try again.');
            setIsCorrect(false);
        }
    };
    
    // Initial analysis
    analyzeFrame();
    // Subsequent analyses on an interval
    analysisIntervalRef.current = setInterval(analyzeFrame, 3000);
  };

  const stopAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    setAnalysisState('camera_on');
    setFeedback(null);
    setKeypoints([]);
  };

 useEffect(() => {
    if (canvasRef.current && videoRef.current && keypoints.length > 0) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const keypointsMap = new Map(keypoints.map(kp => [kp.name, kp]));
      const color = isCorrect ? '#10B981' : '#F97316';
      
      // Draw lines for segments
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      BODY_SEGMENTS.forEach(([startName, endName]) => {
        const startKp = keypointsMap.get(startName);
        const endKp = keypointsMap.get(endName);

        if (startKp && endKp) {
          const startX = startKp.x * canvas.width;
          const startY = startKp.y * canvas.height;
          const endX = endKp.x * canvas.width;
          const endY = endKp.y * canvas.height;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      });
      
      // Draw circles for keypoints
      ctx.fillStyle = color;
      keypoints.forEach(kp => {
        const x = kp.x * canvas.width;
        const y = kp.y * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }, [keypoints, isCorrect]);


  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>1. Setup Your Exercise</CardTitle>
          <CardDescription>
            Select an exercise to get real-time form feedback.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...setupForm}>
            <form>
              <FormField
                control={setupForm.control}
                name="exercise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exercise</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={analysisState === 'analyzing'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an exercise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {exercises.map(ex => (
                            <SelectItem key={ex.value} value={ex.value}>{ex.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>2. AI Coach</CardTitle>
          <CardDescription>Your live video feed and posture feedback.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {analysisState === 'idle' && (
                 <div className="absolute flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
                    <PersonStanding className="h-12 w-12 mb-4" />
                    <h3 className="font-semibold text-lg text-foreground mb-1">Ready to train?</h3>
                    <ul className="text-sm list-disc list-inside text-left">
                        <li>Position your full body in the frame.</li>
                        <li>Ensure good lighting.</li>
                        <li>Click "Start Camera" to begin.</li>
                    </ul>
                </div>
            )}
             {analysisState === 'permission' && (
                <div className="absolute flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
                    <Loader2 className="h-12 w-12 mb-4 animate-spin" />
                    <p>Waiting for camera permission...</p>
                </div>
            )}
             {hasCameraPermission === false && (
                 <Alert variant="destructive" className="absolute w-auto m-4">
                    <CameraOff className="h-4 w-4" />
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>Please enable camera permissions to proceed.</AlertDescription>
                </Alert>
            )}

          </div>
          <div className="h-20">
            {feedback && (
                <Alert variant={isCorrect ? 'default' : 'destructive'} className={`${isCorrect ? 'border-green-500' : ''}`}>
                    {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{isCorrect ? 'Good Form!' : 'Correction Needed'}</AlertTitle>
                    <AlertDescription>
                        {feedback}
                    </AlertDescription>
                </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          {analysisState !== 'analyzing' && analysisState !== 'camera_on' && analysisState !== 'permission' && (
            <Button onClick={requestCameraPermission} disabled={!canProceed || analysisState === 'permission'}>
              <Camera className="mr-2" /> Start Camera
            </Button>
          )}

          {(analysisState === 'analyzing' || analysisState === 'camera_on') && (
            <Button onClick={stopCamera} variant="outline">
              <CameraOff className="mr-2" /> Stop Camera
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

    