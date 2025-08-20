import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Phone, Calendar, MessageCircle, CheckCircle, Send, MapPin } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 themed-bg-gradient">
      <div className="max-w-7xl mx-auto px-4" data-testid="contact-section">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold themed-text mb-4">Contact & Support Hub</h2>
          <p className="text-xl themed-text-secondary max-w-3xl mx-auto">
            Get in touch with our team, access support resources, or schedule meetings with our education specialists.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="themed-bg-secondary shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl themed-text flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {!isSubmitted ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="themed-text">First Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="John" 
                                  className="themed-bg" 
                                  data-testid="first-name-input"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="themed-text">Last Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Doe" 
                                  className="themed-bg"
                                  data-testid="last-name-input"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="themed-text">Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="john@example.com" 
                                className="themed-bg"
                                data-testid="email-input"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="themed-text">Subject</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="themed-bg" data-testid="subject-select">
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="general">General Inquiry</SelectItem>
                                <SelectItem value="support">Technical Support</SelectItem>
                                <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                                <SelectItem value="content">Content Suggestion</SelectItem>
                                <SelectItem value="bug">Bug Report</SelectItem>
                                <SelectItem value="feedback">Feedback</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="themed-text">Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                rows={5} 
                                placeholder="Tell us how we can help you..."
                                className="themed-bg resize-none"
                                data-testid="message-textarea"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={contactMutation.isPending}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                        data-testid="submit-button"
                      >
                        {contactMutation.isPending ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                    data-testid="success-message"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold themed-text mb-4">Message Sent!</h3>
                    <p className="themed-text-secondary mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      data-testid="send-another-button"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Contact Information & Support */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Contact Methods */}
            <Card className="themed-bg-secondary shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl themed-text">Get in Touch</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6" data-testid="contact-methods">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold themed-text">Email Support</h4>
                    <p className="themed-text-secondary">support@funda-app.co.za</p>
                    <p className="text-sm themed-text-secondary">Response within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold themed-text">Phone Support</h4>
                    <p className="themed-text-secondary">+27 11 234 5678</p>
                    <p className="text-sm themed-text-secondary">Mon-Fri, 8AM-6PM (SAST)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold themed-text">Schedule Meeting</h4>
                    <p className="themed-text-secondary">Book a consultation</p>
                    <Button 
                      variant="link" 
                      className="text-purple-600 hover:text-purple-700 p-0 h-auto font-medium"
                      data-testid="schedule-meeting-button"
                    >
                      Schedule Now →
                    </Button>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold themed-text">Office Location</h4>
                    <p className="themed-text-secondary">Cape Town, South Africa</p>
                    <p className="text-sm themed-text-secondary">Visit by appointment only</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Live Chat Widget */}
            <Card className="themed-bg-secondary shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl themed-text">Live Chat Support</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=200" 
                    alt="Professional support team workspace" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex items-center justify-between mb-4" data-testid="chat-status">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium themed-text">Support team online</span>
                  </div>
                  <span className="text-xs themed-text-secondary">Avg. response: 2 mins</span>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
                  data-testid="start-chat-button"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>
            
            {/* FAQ Section Preview */}
            <Card className="themed-bg-secondary shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl themed-text">Quick Help</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4" data-testid="faq-preview">
                  <div className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-semibold themed-text mb-2">How do I join a study group?</h4>
                    <p className="text-sm themed-text-secondary">Click on any study group from the dashboard to join instantly.</p>
                  </div>
                  
                  <div className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-semibold themed-text mb-2">Is the platform free to use?</h4>
                    <p className="text-sm themed-text-secondary">Yes! All basic features are completely free for all South African learners.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold themed-text mb-2">Which languages are supported?</h4>
                    <p className="text-sm themed-text-secondary">We support all 11 official South African languages.</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-6"
                  data-testid="view-all-faq-button"
                >
                  View All FAQs →
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
