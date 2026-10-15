import { Button } from "@/components/ui/button";
import { Award, Download, Share2, Instagram, Camera } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logoPath from "@assets/1x1_logo_for_website_which_sells_dig.webp";

// Convert logo to base64 for high quality rendering
const getLogoBase64 = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Could not get canvas context');
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const base64 = canvas.toDataURL('image/png');
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = reject;
    img.src = logoPath;
  });
};
import * as QRCode from "qrcode";

export default function CertificateOfCompletion() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userName, setUserName] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedQuote, setSelectedQuote] = useState("");
  const [certificateFormat, setCertificateFormat] = useState("square");

  const motivationalTitles = [
    "Discipline Architect",
    "Energy Alchemist", 
    "Mindful Pioneer",
    "Transformation Catalyst",
    "Wellness Warrior",
    "Reset Champion",
    "Clarity Creator",
    "Life Designer"
  ];

  const motivationalQuotes = [
    "In just 24 hours, I changed everything.",
    "Reset. Rebuild. Rise.",
    "I hit reset and found clarity.",
    "Today I chose transformation.",
    "One day. Infinite possibilities.",
    "I am the author of my reset story."
  ];

  const generateCertificate = () => {
    setIsGenerating(true);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      setIsGenerating(false);
      return;
    }
    
    // Set dimensions based on format
    if (certificateFormat === 'square') {
      canvas.width = 1080;
      canvas.height = 1080;
    } else {
      canvas.width = 1080;
      canvas.height = 1920;
    }
    
    // Generate QR code and logo base64, then draw certificate
    Promise.all([
      QRCode.toDataURL('https://perfectdayreset.com', {
        width: 140,
        margin: 0,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).catch(() => null),
      getLogoBase64().catch(() => null)
    ]).then(([qrDataURL, logoBase64]) => {
      drawCertificate(ctx, canvas.width, canvas.height, canvas, qrDataURL, logoBase64);
    });
  };

  const drawCertificate = (ctx: CanvasRenderingContext2D, width: number, height: number, canvas: HTMLCanvasElement, qrDataURL: string | null, logoBase64: string | null) => {
    const isSquare = height === width;
    const centerX = width / 2;
    
    // Create dynamic gradient background
    const gradient = ctx.createRadialGradient(centerX, height/2, 0, centerX, height/2, Math.max(width, height));
    gradient.addColorStop(0, '#1e40af'); // Deep blue center
    gradient.addColorStop(0.4, '#3b82f6'); // Bright blue
    gradient.addColorStop(0.7, '#f59e0b'); // Orange
    gradient.addColorStop(1, '#dc2626'); // Red edge
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add sunburst effect behind name area
    const sunburstGradient = ctx.createRadialGradient(centerX, height * 0.45, 0, centerX, height * 0.45, width * 0.6);
    sunburstGradient.addColorStop(0, 'rgba(255,255,255,0.3)');
    sunburstGradient.addColorStop(0.5, 'rgba(255,255,255,0.1)');
    sunburstGradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = sunburstGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add energy lines radiating from center
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(centerX, height * 0.45);
      ctx.lineTo(
        centerX + Math.cos(angle) * width * 0.7,
        height * 0.45 + Math.sin(angle) * height * 0.7
      );
      ctx.stroke();
    }
    ctx.restore();
    
    // Logo in top-left - keep original dimensions and quality
    const logoWidth = isSquare ? 180 : 220;
    const logoHeight = isSquare ? 72 : 88;
    const logoX = 30;
    const logoY = 30;
    
    // Draw simple white background for logo
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillRect(logoX - 10, logoY - 10, logoWidth + 20, logoHeight + 20);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(logoX - 10, logoY - 10, logoWidth + 20, logoHeight + 20);
    
    // Draw logo at original quality - no manipulation
    if (logoBase64) {
      const logoImg = new Image();
      logoImg.onload = () => {
        // Enable high-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw logo at exact dimensions, preserving aspect ratio
        ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
      };
      logoImg.src = logoBase64;
    }
    
    // Glowing badge in top-right - balanced with logo
    const badgeSize = isSquare ? 130 : 150;
    const badgeX = width - badgeSize - 30;
    const badgeY = 30;
    
    // Badge glow effect
    ctx.save();
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(badgeX + badgeSize/2, badgeY + badgeSize/2, badgeSize/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Badge inner circle
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.arc(badgeX + badgeSize/2, badgeY + badgeSize/2, badgeSize/2 - 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Badge text with glow
    ctx.save();
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${isSquare ? '18px' : '20px'} Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('RESET: 24H', badgeX + badgeSize/2, badgeY + badgeSize/2 - 10);
    ctx.fillText('ACHIEVER', badgeX + badgeSize/2, badgeY + badgeSize/2 + 10);
    
    // Add badge icons
    ctx.font = `${isSquare ? '24px' : '28px'} serif`;
    ctx.fillText('🏅', badgeX + badgeSize/2, badgeY + badgeSize/2 + 35);
    ctx.restore();
    
    // Bold headline
    const titleY = isSquare ? height * 0.15 : height * 0.12;
    ctx.save();
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${isSquare ? '52px' : '72px'} Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE', centerX, titleY);
    ctx.font = `bold ${isSquare ? '36px' : '48px'} Inter, sans-serif`;
    ctx.fillText('OF COMPLETION', centerX, titleY + (isSquare ? 65 : 85));
    ctx.restore();
    
    // User name with dramatic glow and gradient
    const nameY = isSquare ? height * 0.38 : height * 0.35;
    ctx.save();
    
    // Create gradient for name
    const nameGradient = ctx.createLinearGradient(0, nameY - 40, 0, nameY + 40);
    nameGradient.addColorStop(0, '#ffffff');
    nameGradient.addColorStop(1, '#fbbf24');
    
    ctx.fillStyle = nameGradient;
    ctx.font = `bold ${isSquare ? '48px' : '64px'} Georgia, serif`;
    ctx.textAlign = 'center';
    
    // Multiple shadow layers for dramatic effect
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 4;
    ctx.fillText(userName || '[Your Name]', centerX, nameY);
    
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = '#fbbf24';
    ctx.fillText(userName || '[Your Name]', centerX, nameY);
    ctx.restore();
    
    // Title earned in italic
    if (selectedTitle) {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = `italic ${isSquare ? '28px' : '36px'} Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 10;
      ctx.fillText(`"${selectedTitle}"`, centerX, nameY + (isSquare ? 60 : 75));
      ctx.restore();
    }
    
    // Achievement text
    const achievementY = nameY + (isSquare ? 120 : 150);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${isSquare ? '20px' : '24px'} Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 8;
    
    ctx.fillText('Successfully completed The Perfect Day Reset', centerX, achievementY);
    ctx.fillText('24-hour transformation protocol', centerX, achievementY + (isSquare ? 32 : 38));
    
    // Motivational quote in bold white
    if (selectedQuote) {
      const quoteY = achievementY + (isSquare ? 90 : 110);
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold italic ${isSquare ? '26px' : '32px'} Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 15;
      ctx.fillText(`"${selectedQuote}"`, centerX, quoteY);
      ctx.restore();
    }
    
    // Inspirational message
    const inspirationY = isSquare ? height * 0.75 : height * 0.72;
    ctx.save();
    ctx.fillStyle = '#fbbf24';
    ctx.font = `bold ${isSquare ? '22px' : '26px'} Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 10;
    ctx.fillText('You are more capable than you think 💪✨', centerX, inspirationY);
    ctx.restore();
    
    // Large QR code with background
    const qrSize = isSquare ? 120 : 140;
    const qrX = centerX - qrSize/2;
    const qrY = isSquare ? height * 0.82 : height * 0.8;
    
    // QR background box
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 60);
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    ctx.strokeRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 60);
    
    // Draw actual QR code or fallback
    if (qrDataURL) {
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      };
      qrImg.src = qrDataURL;
    } else {
      // Fallback if QR generation fails
      ctx.fillStyle = '#000000';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${isSquare ? '16px' : '18px'} Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('QR CODE', qrX + qrSize/2, qrY + qrSize/2);
    }
    
    // QR tagline - make it more visible with white text and shadow
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${isSquare ? '16px' : '18px'} Inter, sans-serif`;
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillText('You can do it too. Start your reset today.', qrX + qrSize/2, qrY + qrSize + 25);
    ctx.restore();
    
    // Shareable footer
    const footerY = height - 30;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(0, footerY - 25, width, 55);
    
    ctx.fillStyle = '#1e40af';
    ctx.font = `bold ${isSquare ? '18px' : '20px'} Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Share your achievement 🌟 #PerfectDayReset', centerX, footerY + 5);
    
    // Date in corner
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = `${isSquare ? '12px' : '14px'} Inter, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(new Date().toLocaleDateString(), width - 20, height - 10);
    
    // Convert to download
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `perfect-day-reset-certificate-${certificateFormat}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      setIsGenerating(false);
    }, 1000);
  };



  return (
    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-8 rounded-xl border border-emerald-200">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full mb-4 shadow-lg">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-2">
          Certificate of Completion
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          🎉 Create your stunning, social media-ready certificate! Energetic design optimized for Instagram, TikTok, and Facebook sharing.
        </p>
      </div>

      <div className="max-w-lg mx-auto mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name (for certificate)
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Transformation Title
          </label>
          <Select value={selectedTitle} onValueChange={setSelectedTitle}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose your earned title" />
            </SelectTrigger>
            <SelectContent>
              {motivationalTitles.map((title) => (
                <SelectItem key={title} value={title}>{title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Motivational Quote
          </label>
          <Select value={selectedQuote} onValueChange={setSelectedQuote}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pick your transformation quote" />
            </SelectTrigger>
            <SelectContent>
              {motivationalQuotes.map((quote) => (
                <SelectItem key={quote} value={quote}>{quote}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certificate Format
          </label>
          <Select value={certificateFormat} onValueChange={setCertificateFormat}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">
                <div className="flex items-center">
                  <Instagram className="w-4 h-4 mr-2" />
                  Square (1080x1080) - Perfect for Instagram & Facebook
                </div>
              </SelectItem>
              <SelectItem value="story">
                <div className="flex items-center">
                  <Camera className="w-4 h-4 mr-2" />
                  Vertical (1080x1920) - Perfect for Stories & TikTok
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={generateCertificate}
          disabled={isGenerating || !userName.trim() || !selectedTitle || !selectedQuote}
          className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg flex items-center justify-center shadow-lg"
        >
          <Download className="w-5 h-5 mr-2" />
          {isGenerating ? "Creating Magic..." : `Generate ${certificateFormat === 'square' ? 'Square' : 'Story'} Certificate`}
        </Button>
        
        <Button 
          variant="outline"
          className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-lg flex items-center justify-center"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'I completed The Perfect Day Reset!',
                text: 'Just finished an amazing wellness transformation program. Feeling incredible!',
                url: window.location.href
              });
            }
          }}
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share Achievement
        </Button>
      </div>


    </div>
  );
}