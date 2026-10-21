

'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { BarChart, BrainCircuit, Home, LogOut, User, PersonStanding, Heart, Settings, Bot, Trophy, Award, Flame, BookOpen } from 'lucide-react';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Chatbot } from '@/components/chatbot';
import { ConfettiProvider } from '@/components/confetti-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Added to fix hydration error. See https://nextjs.org/docs/messages/react-hydration-error
  const [isClient, setIsClient] = React.useState(false)
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <ConfettiProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard'}
                  tooltip="Dashboard"
                >
                  <Link href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/progress')}
                  tooltip="Progress"
                >
                  <Link href="/dashboard/progress">
                    <BarChart />
                    <span>Progress</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                  <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/leaderboard')}
                      tooltip="Leaderboard"
                  >
                      <Link href="/dashboard/leaderboard">
                          <Trophy />
                          <span>Leaderboard</span>
                      </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                  <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/badges')}
                      tooltip="Badges"
                  >
                      <Link href="/dashboard/badges">
                          <Award />
                          <span>Badges</span>
                      </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/challenges')}
                  tooltip="Challenges"
                >
                  <Link href="/dashboard/challenges">
                    <Flame />
                    <span>Challenges</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/plan')}
                  tooltip="Personalized Plan"
                >
                  <Link href="/dashboard/plan">
                    <BrainCircuit />
                    <span>Personalized Plan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/posture')}
                  tooltip="Posture Correction"
                >
                  <Link href="/dashboard/posture">
                    <PersonStanding />
                    <span>Posture</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/wellness')}
                  tooltip="Mental Wellness"
                >
                  <Link href="/dashboard/wellness">
                    <Heart />
                    <span>Wellness</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/yoga')}
                  tooltip="Yoga Library"
                >
                  <Link href="/dashboard/yoga">
                    <BookOpen />
                    <span>Yoga Library</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/settings')}
                  tooltip="Settings"
                >
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="justify-start w-full gap-2 p-2 h-auto">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/seed/athlete/100/100" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">Athlete 123</p>
                    <p className="text-xs text-muted-foreground">SAI-ID: 98765</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Athlete 123</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      athlete.123@sai.gov.in
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-xl font-semibold font-headline">Sports Authority of India</h1>
            </div>
            <div className="w-7 h-7" />
          </header>
          {children}
          {isClient && <Popover>
              <PopoverTrigger asChild>
                  <Button className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg">
                      <Bot className="w-8 h-8" />
                  </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 h-[60vh] mr-4 flex flex-col">
                  <Chatbot />
              </PopoverContent>
          </Popover>}
        </SidebarInset>
      </SidebarProvider>
    </ConfettiProvider>
  );
}
