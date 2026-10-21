
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dailyYogaPoses } from '@/lib/yoga-poses';
import Image from 'next/image';
import { Button } from './ui/button';
import { Languages, Speaker, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type Language = 'en' | 'hi' | 'ta' | 'bn' | 'te' | 'mr';

const languageMap: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  ta: 'தமிழ்',
  bn: 'বাংলা',
  te: 'తెలుగు',
  mr: 'मराठी',
};


export function YogaLibrary() {
  const [language, setLanguage] = useState<Language>('en');
  const [playingPose, setPlayingPose] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingPose, setLoadingPose] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    // Stop any playing audio when language changes
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingPose(null);
    setAudioUrl(null);
  };

  const handlePlayAudio = async (poseName: string, text: string) => {
    if (loadingPose === poseName) return;

    // If another pose is playing, stop it
    if (audioRef.current && playingPose && playingPose !== poseName) {
      audioRef.current.pause();
      setPlayingPose(null);
    }
    
    // If the clicked pose is already playing, pause it
    if (playingPose === poseName && audioRef.current) {
      audioRef.current.pause();
      setPlayingPose(null);
      return;
    }

    // If we have the audio, just play it
    if (audioUrl && playingPose === poseName && audioRef.current) {
        audioRef.current.play();
        return;
    }

    setLoadingPose(poseName);
    setAudioUrl(null);

    try {
      const { audioDataUri } = await textToSpeech({ text });
      setAudioUrl(audioDataUri);
      setPlayingPose(poseName);
    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        variant: 'destructive',
        title: 'Audio Error',
        description: 'Could not generate audio for this pose.',
      });
      setPlayingPose(null);
    } finally {
      setLoadingPose(null);
    }
  };
  
  // Effect to play audio when URL is set
  if (audioRef.current && audioUrl && audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
  }

  const getPoseDescription = (pose: typeof dailyYogaPoses[0]) => {
    switch(language) {
      case 'hi': return pose.description_hi;
      case 'ta': return pose.description_ta;
      case 'bn': return pose.description_bn;
      case 'te': return pose.description_te;
      case 'mr': return pose.description_mr;
      default: return pose.description_en;
    }
  }

  const getHeaderText = () => {
    switch(language) {
      case 'hi': return 'निर्देश और लाभ';
      case 'ta': return 'வழிமுறைகள் மற்றும் பலன்கள்';
      case 'bn': return 'নির্দেশাবলী এবং সুবিধা';
      case 'te': return 'సూచనలు & ప్రయోజనాలు';
      case 'mr': return 'सूचना आणि फायदे';
      default: return 'Instructions & Benefits';
    }
  }


  return (
    <div className="space-y-6">
       <div className="flex justify-end">
        <Select onValueChange={(value: Language) => handleLanguageChange(value)} defaultValue={language}>
          <SelectTrigger className="w-[180px]">
            <Languages className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(languageMap) as Language[]).map(lang => (
              <SelectItem key={lang} value={lang}>{languageMap[lang]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dailyYogaPoses.map((pose) => (
          <Card key={pose.name} className="flex flex-col transition-transform duration-200 hover:scale-105 hover:shadow-lg">
            <CardHeader>
              <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted">
                <Image
                  src={pose.imageUrl}
                  alt={`Illustration of ${pose.name}`}
                  fill
                  className="object-cover"
                  data-ai-hint={pose.imageHint}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <CardTitle>{language === 'en' ? pose.name : pose.sanskrit_name}</CardTitle>
              <p className="text-sm text-muted-foreground">{pose.sanskrit_name}</p>
              <Separator />
               <div className='space-y-4'>
                <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{getHeaderText()}</h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePlayAudio(pose.name, getPoseDescription(pose))}
                              disabled={loadingPose === pose.name}
                            >
                              {loadingPose === pose.name ? (
                                  <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                  <Speaker className="h-5 w-5" />
                              )}
                              <span className="sr-only">Listen to description</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Listen to description</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {getPoseDescription(pose)}
                    </p>
                </div>
               </div>
               {playingPose === pose.name && audioUrl && (
                  <div className="pt-2">
                      <audio
                          ref={audioRef}
                          controls
                          className="w-full"
                          src={audioUrl}
                          onEnded={() => setPlayingPose(null)}
                          onPause={() => setPlayingPose(null)}
                      >
                          Your browser does not support the audio element.
                      </audio>
                  </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
