import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { generateVirtualTryOnImage } from './services/geminiService';
import ChevronDownIcon from './components/icons/ChevronDownIcon';
import CustomCursor from './components/CustomCursor';
import { playSound } from './services/soundService';

type Page = 'home' | 'tool' | 'about' | 'contact' | 'privacy' | 'terms';

// =================================================================
// HERO COMPONENT
// =================================================================
const Hero: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
  <section className="text-center py-20 md:py-32 animate-page-fade-in [animation-delay:100ms]">
    <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-100">
      See Yourself in Any Outfit.
    </h2>
    <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
      Stop guessing. Start seeing. Our AI-powered tool lets you virtually try on clothes from any store, using just your photo. Experience the future of shopping.
    </p>
    <button
      onClick={() => {
        playSound('click');
        onNavigate('tool');
      }}
      className="mt-8 inline-block px-10 py-4 bg-violet-600 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:bg-violet-500 hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 active:scale-95"
    >
      Try It Now
    </button>
  </section>
);

// =================================================================
// HOW IT WORKS COMPONENT
// =================================================================
const HowItWorks: React.FC = () => (
  <section id="how-it-works" className="py-16 animate-page-fade-in [animation-delay:200ms]">
    <div className="text-center mb-12">
      <h3 className="text-3xl md:text-4xl font-bold">How It Works</h3>
      <p className="text-slate-400 mt-2">Get your new look in three simple steps.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div className="bg-[#111827]/60 p-6 rounded-2xl shadow-lg border border-slate-800">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/30 to-violet-600/30 mx-auto mb-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <h4 className="text-xl font-semibold mb-2">1. Upload Your Photo</h4>
        <p className="text-slate-400">Choose a clear, full-body photo of yourself.</p>
      </div>
      <div className="bg-[#111827]/60 p-6 rounded-2xl shadow-lg border border-slate-800">
         <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/30 to-violet-600/30 mx-auto mb-4 flex items-center justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </div>
        <h4 className="text-xl font-semibold mb-2">2. Upload an Outfit</h4>
        <p className="text-slate-400">Provide an image of the clothing item you want to try.</p>
      </div>
      <div className="bg-[#111827]/60 p-6 rounded-2xl shadow-lg border border-slate-800">
         <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/30 to-violet-600/30 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>
        </div>
        <h4 className="text-xl font-semibold mb-2">3. Get Your Fit</h4>
        <p className="text-slate-400">Our AI generates a realistic image of you in the new outfit.</p>
      </div>
    </div>
  </section>
);

// =================================================================
// FEATURE COMPONENTS
// =================================================================
const FeatureCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-[#111827]/60 p-6 rounded-2xl shadow-lg border border-slate-800 flex items-start space-x-4">
    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/30 to-violet-600/30 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-slate-400">{children}</p>
    </div>
  </div>
);

const Features: React.FC = () => (
    <section id="features" className="py-16 animate-page-fade-in [animation-delay:400ms]">
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold">The Future of Fashion is Here</h3>
        <p className="text-slate-400 mt-2">Discover a new way to shop and express yourself.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FeatureCard title="Visualize Before You Buy" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}>
          No more wondering "how would that look on me?". Get a realistic preview and shop with confidence.
        </FeatureCard>
        <FeatureCard title="Explore Styles Instantly" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>}>
          Experiment with different looks and discover new brands without leaving your home. Your next favorite outfit is just an upload away.
        </FeatureCard>
         <FeatureCard title="Powered by Advanced AI" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3M5.636 5.636l-1.414-1.414M19.778 19.778l-1.414-1.414M18.364 5.636l-1.414 1.414M4.222 19.778l1.414-1.414M12 12a6 6 0 110-12 6 6 0 010 12z" /></svg>}>
          We use state-of-the-art generative AI to ensure results are realistic, detailed, and true to your form.
        </FeatureCard>
        <FeatureCard title="Private and Secure" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}>
          Your privacy is paramount. Images are processed securely and are never stored or shared.
        </FeatureCard>
      </div>
    </section>
);


// =================================================================
// FAQ COMPONENTS
// =================================================================
const FAQItem: React.FC<{ question: string; children: React.ReactNode; }> = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    playSound('click');
    setIsOpen(!isOpen);
  };
  return (
    <div className="border-b border-slate-800">
      <button
        onClick={handleClick}
        className="w-full flex justify-between items-center text-left py-4"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-lg">{question}</span>
        <ChevronDownIcon className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="pb-4 text-slate-400">
          {children}
        </div>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => (
    <section id="faq" className="py-16 animate-page-fade-in [animation-delay:500ms]">
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h3>
      </div>
      <div className="max-w-3xl mx-auto bg-[#111827]/60 p-6 rounded-2xl shadow-lg border border-slate-800">
        <FAQItem question="What kind of photos work best?">
          <p>For best results, use a clear, well-lit, full-body photo of yourself where your pose is relatively simple. For the clothing, use a clear photo of the item on a plain background, like a product photo from a store.</p>
        </FAQItem>
        <FAQItem question="Are my photos stored on your servers?">
          <p>No. Your privacy is our top priority. Your images are sent to the AI model for processing and are not stored or used for any other purpose. The generated image is available for you to download, and then it's gone.</p>
        </FAQItem>
        <FAQItem question="How accurate is the virtual try-on?">
          <p>Our AI is highly advanced and does an excellent job of realistically draping the clothing onto your photo, matching your body shape, and adjusting for lighting. While it's a very realistic simulation, it's intended for style visualization, not as a perfect sizing tool.</p>
        </FAQItem>
         <FAQItem question="Can I use any type of clothing?">
          <p>Currently, the tool works best with single items like shirts, dresses, jackets, and pants. Complex layered outfits or accessories might produce less predictable results. We're constantly working to improve the AI's capabilities!</p>
        </FAQItem>
      </div>
    </section>
);

// =================================================================
// FOOTER COMPONENT
// =================================================================
const Footer: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  const handleNavClick = (page: Page) => {
    playSound('click');
    onNavigate(page);
  };

  return (
    <footer className="text-center py-10 text-slate-400 text-sm border-t border-slate-800 mt-16">
      <p className="font-bold text-lg text-slate-200">For The Fit</p>
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 my-4">
        <button onClick={() => handleNavClick('about')} className="hover:text-violet-400 transition-colors">About</button>
        <button onClick={() => handleNavClick('contact')} className="hover:text-violet-400 transition-colors">Contact</button>
        <button onClick={() => handleNavClick('privacy')} className="hover:text-violet-400 transition-colors">Privacy Policy</button>
        <button onClick={() => handleNavClick('terms')} className="hover:text-violet-400 transition-colors">Terms of Service</button>
      </div>
      <p>Powered by Gemini AI. All rights reserved.</p>
    </footer>
  );
};


// =================================================================
// HOME PAGE COMPONENT
// =================================================================
const HomePage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
  <>
    <Hero onNavigate={onNavigate} />
    <HowItWorks />
    <Features />
    <FAQ />
  </>
);


// =================================================================
// TOOL PAGE COMPONENT
// =================================================================
const ToolPage: React.FC = () => {
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [outfitFile, setOutfitFile] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTryOn = useCallback(async () => {
    playSound('click');
    if (!personFile || !outfitFile) {
      setError("Please upload both your image and the outfit's image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultImage = await generateVirtualTryOnImage(personFile, outfitFile);
      setGeneratedImage(resultImage);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [personFile, outfitFile]);
  
  const handleReset = () => {
    playSound('click');
    setPersonFile(null);
    setOutfitFile(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <section id="tool" className="py-16 animate-page-fade-in [animation-delay:100ms]">
       <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
            Try It Yourself
          </span>
        </h3>
        <p className="text-slate-400 mt-2">Upload your images below to get started.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 bg-[#111827]/60 p-6 rounded-2xl shadow-lg border border-slate-800 shadow-[0_0_20px_rgba(120,81,169,0.15)] backdrop-blur-md order-2 lg:order-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              title="Your Image"
              onFileSelect={setPersonFile}
              file={personFile}
              description="A clear, full-body photo of you."
              aspectRatioHint="9:16 portrait"
            />
            <ImageUploader
              title="Outfit Image"
              onFileSelect={setOutfitFile}
              file={outfitFile}
              description="A photo of the clothing item."
              aspectRatioHint="1:1 square"
            />
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleTryOn}
              disabled={!personFile || !outfitFile || isLoading}
              className="w-full sm:w-auto px-8 py-3 bg-violet-600 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:bg-violet-500 hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
            >
              {isLoading ? 'Generating...' : 'Get The Fit'}
            </button>
             {(personFile || outfitFile || generatedImage || isLoading) && (
               <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-8 py-3 bg-transparent border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-800 hover:border-slate-400 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                >
                Reset
               </button>
             )}
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-[#111827]/60 p-6 rounded-2xl shadow-lg border border-slate-800 shadow-[0_0_20px_rgba(120,81,169,0.15)] backdrop-blur-md order-1 lg:order-2">
          <ResultDisplay
            generatedImage={generatedImage}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </section>
  );
};

// =================================================================
// CONTENT PAGE COMPONENTS
// =================================================================

const ContentPageWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="py-16 animate-page-fade-in">
    <div className="max-w-4xl mx-auto bg-[#111827]/60 p-8 rounded-2xl shadow-lg border border-slate-800">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-violet-400">{title}</h2>
      <div className="prose prose-invert prose-lg max-w-none text-slate-300 prose-h3:text-slate-100 prose-h3:font-semibold prose-a:text-violet-400 hover:prose-a:text-violet-300">
        {children}
      </div>
    </div>
  </section>
);

const AboutPage: React.FC = () => (
  <ContentPageWrapper title="About Us">
    <p>Welcome to For The Fit, where fashion meets the future. We are a passionate team of developers, designers, and fashion enthusiasts dedicated to revolutionizing the way you shop for clothes.</p>
    
    <h3>Our Mission</h3>
    <p>Our mission is simple: to eliminate the guesswork and uncertainty of online shopping. We believe that everyone should be able to shop with confidence, knowing exactly how an outfit will look on them before they buy. By harnessing the power of artificial intelligence, we're making that vision a reality.</p>

    <h3>The Technology</h3>
    <p>For The Fit is powered by state-of-the-art generative AI. When you upload your photo and an image of a clothing item, our advanced algorithms analyze your body shape, pose, and the garment's texture, drape, and fit. It then generates a new, photorealistic image showing you wearing the outfit in stunning detail. This isn't just a simple overlay; it's a sophisticated simulation designed to provide the most realistic virtual try-on experience possible.</p>

    <h3>Our Story</h3>
    <p>The idea for For The Fit was born from a shared frustration with online shopping—the hassle of returns, the disappointment of items not fitting as expected, and the inability to visualize styles. We knew there had to be a better way. We assembled a team dedicated to solving this problem, and after countless hours of research, development, and training our AI models, For The Fit was launched.</p>
    <p>We are continuously working to improve our technology and expand our features. Thank you for joining us on this journey to create a smarter, more personalized, and more enjoyable shopping experience for everyone.</p>
  </ContentPageWrapper>
);

const ContactPage: React.FC = () => (
  <ContentPageWrapper title="Contact Us">
    <p>We'd love to hear from you! Whether you have a question, feedback, or a partnership inquiry, please don't hesitate to reach out.</p>

    <h3>General Inquiries</h3>
    <p>For general questions or feedback about our tool, please email us at: <a href="mailto:zuphonit@gmail.com">zuphonit@gmail.com</a>.</p>

    <h3>Support</h3>
    <p>If you're experiencing technical issues or need help using the virtual try-on tool, please contact our support team at: <a href="mailto:zuphonit@gmail.com">zuphonit@gmail.com</a>.</p>

    <h3>Business & Press</h3>
    <p>For all business development, partnership, and press inquiries, please contact: <a href="mailto:zuphonit@gmail.com">zuphonit@gmail.com</a>.</p>

    <p>We do our best to respond to all inquiries within 48 business hours.</p>
  </ContentPageWrapper>
);

const PrivacyPolicyPage: React.FC = () => (
    <ContentPageWrapper title="Privacy Policy">
        <p>Your privacy is critically important to us. This Privacy Policy outlines how For The Fit handles your information.</p>

        <h3>1. Information We Do Not Collect or Store</h3>
        <p>We have designed our service with your privacy as a top priority. We do not collect, store, or share any personally identifiable information. Specifically:</p>
        <ul>
            <li><strong>Uploaded Images:</strong> The photos you upload (of yourself and clothing items) are processed in memory by our AI model to generate the try-on image. They are never saved to our servers or any permanent storage. They are discarded immediately after the generation process is complete.</li>
            <li><strong>Generated Images:</strong> The final try-on image we generate is provided to you for download. We do not store this image.</li>
            <li><strong>Personal Data:</strong> We do not require you to create an account, and therefore we do not collect names, email addresses, or any other personal data.</li>
        </ul>

        <h3>2. How We Use Your Images</h3>
        <p>The images you provide are used for the sole purpose of creating the virtual try-on result. They are not used for AI model training, marketing, or any other purpose.</p>
        
        <h3>3. Cookies and Analytics</h3>
        <p>We may use anonymous analytics tools to understand website traffic and usage patterns. This data is aggregated and cannot be used to identify individual users. We do not use tracking cookies that collect personal information.</p>

        <h3>4. Changes to This Policy</h3>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We encourage you to review this Privacy Policy periodically for any changes.</p>

        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@forthefit.com">privacy@forthefit.com</a>.</p>
    </ContentPageWrapper>
);

const TermsOfServicePage: React.FC = () => (
    <ContentPageWrapper title="Terms of Service">
        <p>By using the For The Fit website and its AI virtual try-on tool, you agree to these Terms of Service.</p>

        <h3>1. Use of Service</h3>
        <p>You agree to use our service for its intended purpose of virtually trying on clothing. You agree not to upload any content that is illegal, harmful, offensive, or infringing on the rights of others.</p>

        <h3>2. Intellectual Property</h3>
        <p>You retain all rights to the images you upload. By uploading them, you grant us a temporary, non-exclusive license to process them for the sole purpose of generating your virtual try-on image. We claim no ownership over your content or the generated result.</p>
        
        <h3>3. Disclaimer of Warranties</h3>
        <p>The service is provided "as is". While our AI is highly advanced, the virtual try-on is a simulation and should be used for style visualization purposes only. We do not guarantee perfect accuracy in fit or sizing. We make no warranties, express or implied, regarding the service's reliability, accuracy, or availability.</p>
        
        <h3>4. Limitation of Liability</h3>
        <p>In no event shall For The Fit or its developers be liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use the service.</p>

        <h3>5. Changes to These Terms</h3>
        <p>We reserve the right to modify these terms at any time. Your continued use of the service after any such changes constitutes your acceptance of the new terms.</p>
    </ContentPageWrapper>
);



// =================================================================
// MAIN APP COMPONENT (ROUTER)
// =================================================================
const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [scrollToSection, setScrollToSection] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);
  
  const handleNavigate = (targetPage: Page, sectionId?: string) => {
    // If navigating to a section on the current page (home)
    if (page === 'home' && targetPage === 'home' && sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // If navigating to home from another page to a section
    if (targetPage === 'home' && sectionId) {
      setPage('home');
      setScrollToSection(sectionId);
      return;
    }
    
    // Default navigation
    setPage(targetPage);
    setScrollToSection(null); // Clear any pending scrolls
    window.scrollTo(0, 0);
  };
  
  useEffect(() => {
    if (page === 'home' && scrollToSection) {
      const element = document.getElementById(scrollToSection);
      if (element) {
        // Use a timeout to ensure the DOM is updated before scrolling
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          setScrollToSection(null); // Reset after scrolling
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [page, scrollToSection]);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'tool':
        return <ToolPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsOfServicePage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  }

  return (
    <div className={`min-h-screen text-slate-200 font-sans transition-opacity duration-700 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      <CustomCursor />
      <Header currentPage={page} onNavigate={handleNavigate} />
      <main className="container mx-auto px-4">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;