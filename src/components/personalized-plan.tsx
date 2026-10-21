"use client";

import { generatePersonalizedPlan } from "@/ai/flows/generate-personalized-plan";
import type { GeneratePersonalizedPlanOutput } from "@/ai/flows/generate-personalized-plan";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Dumbbell, Flame, Loader2, Salad, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const formSchema = z.object({
  age: z.coerce.number().min(10, "Age must be at least 10").max(60, "Age must be at most 60"),
  gender: z.enum(["male", "female"]),
  height: z.coerce.number().min(100, "Height must be at least 100cm").max(250, "Height must be at most 250cm"),
  weight: z.coerce.number().min(30, "Weight must be at least 30kg").max(200, "Weight must be at most 200kg"),
  fitnessGoal: z.enum(["weight-loss", "muscle-gain", "endurance"]),
  dietaryPreference: z.enum(["none", "vegetarian", "vegan", "non-veg"]),
  activityLevel: z.enum(['sedentary', 'lightly-active', 'moderately-active', 'very-active']),
});

export function PersonalizedPlan() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<GeneratePersonalizedPlanOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 25,
      gender: 'male',
      height: 175,
      weight: 70,
      fitnessGoal: 'muscle-gain',
      dietaryPreference: 'none',
      activityLevel: 'moderately-active',
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPlan(null);
    try {
      const result = await generatePersonalizedPlan(values);
      setPlan(result);
      toast({
        title: "Your plan is ready!",
        description: "Your personalized diet and workout plan has been generated.",
      });
    } catch (error) {
      console.error("Error generating plan:", error);
      toast({
        variant: "destructive",
        title: "Failed to generate plan",
        description: "There was an issue creating your plan. Please try again.",
      });
    }
    setIsLoading(false);
  }

  const renderPlan = () => {
    if (!plan) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> Your AI-Generated Plan</CardTitle>
          <CardDescription>{plan.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full" defaultValue="Day-1">
            {plan.weeklyPlan.map((dailyPlan, index) => (
              <AccordionItem value={`Day-${index+1}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center font-bold">{index+1}</div>
                    <span className="font-semibold text-lg">{dailyPlan.day}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-4 border-l ml-6">
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2 text-lg"><Dumbbell /> Workout: {dailyPlan.workout.title}</h4>
                      <p className="text-sm text-muted-foreground">{dailyPlan.workout.description}</p>
                      <ul className="space-y-2">
                        {dailyPlan.workout.exercises.map((ex, i) => (
                          <li key={i} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                            <span>{ex.name}</span>
                            <span className="font-mono">{ex.sets} x {ex.reps}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                     <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2 text-lg"><Salad /> Diet Plan</h4>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50">
                          <span className="flex items-center gap-1"><Flame className="text-orange-500" /> Total Calories</span>
                          <span className="font-mono">{dailyPlan.diet.calories} kcal</span>
                      </div>
                      <ul className="space-y-2">
                        {dailyPlan.diet.meals.map((meal, i) => (
                          <li key={i} className="text-sm p-2 rounded-md border">
                            <p className="font-semibold">{meal.name}</p>
                            <p className="text-muted-foreground">{meal.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
          <CardDescription>Provide your details for a plan tailored to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Your age" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 175" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 70" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <div className="grid md:grid-cols-3 gap-4">
                 <FormField
                  control={form.control}
                  name="fitnessGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fitness Goal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weight-loss">Weight Loss</SelectItem>
                          <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                          <SelectItem value="endurance">Endurance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="dietaryPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Preference</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your diet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                          <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                        </SelectContent>
                      </Select>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your activity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                          <SelectItem value="lightly-active">Lightly Active (light exercise/sports 1-3 days/week)</SelectItem>
                          <SelectItem value="moderately-active">Moderately Active (moderate exercise/sports 3-5 days/week)</SelectItem>
                          <SelectItem value="very-active">Very Active (hard exercise/sports 6-7 days a week)</SelectItem>
                        </SelectContent>
                      </Select>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Generating Plan..." : <> <Bot className="mr-2"/> Generate Plan</>}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg font-semibold">Our AI is crafting your personalized plan...</p>
            <p className="text-muted-foreground">This may take a few moments.</p>
        </div>
      )}

      {renderPlan()}
    </div>
  );
}
