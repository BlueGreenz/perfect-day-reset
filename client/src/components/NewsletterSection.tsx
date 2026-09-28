import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const subscribeFormSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

type SubscribeFormValues = z.infer<typeof subscribeFormSchema>;

export default function NewsletterSection() {
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SubscribeFormValues>({
    resolver: zodResolver(subscribeFormSchema),
    defaultValues: {
      email: ""
    }
  });

  const subscribeMutation = useMutation({
    mutationFn: async (data: SubscribeFormValues) => {
      return apiRequest("POST", "/api/subscribe", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
        variant: "default",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Something went wrong.",
        description: error instanceof Error ? error.message : "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: SubscribeFormValues) => {
    subscribeMutation.mutate(data);
  };

  return (
    <section className="section bg-primary text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
          <p className="max-w-2xl mx-auto opacity-90">Join our community and start your journey toward a more balanced, productive, and fulfilling daily routine.</p>
        </div>
        
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                placeholder="Your email address"
                className="px-4 py-3 rounded-lg focus:outline-none text-gray-700 w-full"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-200 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="cta-button bg-white text-primary font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition"
              disabled={subscribeMutation.isPending}
            >
              {subscribeMutation.isPending ? "Subscribing..." : "Get Started"}
            </Button>
          </form>
          <p className="text-sm mt-3 opacity-80 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
          
          <div className="text-center mt-8">
            <p className="font-medium mb-3">Ready to transform your day right now?</p>
            <a 
              href="/what-you-get"
            >
              <Button 
                className="cta-button bg-white text-primary font-medium px-8 py-3 rounded-full hover:bg-gray-100 transition"
              >
                Get the Perfect Day Reset – $19
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
