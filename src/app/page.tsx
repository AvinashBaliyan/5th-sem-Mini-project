
import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { placeholderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function LoginPage() {
  const bgImage = placeholderImages.find((img) => img.id === 'login-bg');
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage: bgImage ? `url(${bgImage.imageUrl})` : 'none',
      }}
    >
      <div className="absolute inset-0 bg-black/70 -z-10" />
      <div className="w-full max-w-md">
        <Card className="bg-card/90 backdrop-blur-lg border-white/10">
          <CardHeader className="items-center text-center">
            <div className="mb-4">
              <Logo />
            </div>
            <h1 className="text-2xl font-bold font-headline">Welcome to LAKSHYA</h1>
            <p className="text-muted-foreground">
              Your journey to excellence starts here. Please log in to record your assessment.
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
             <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                </Link>
             </p>
          </CardFooter>
        </Card>
        <p className="text-xs text-center mt-4 text-background/70">
          A platform by Sports Authority of India for transparent, AI-powered talent assessment.
        </p>
      </div>
    </main>
  );
}
