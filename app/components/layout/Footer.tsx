"use client"

import { Sparkles, Github, Twitter, Mail, Heart } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-1/3 h-1/2"
          style={{
            clipPath: "polygon(0 0, 100% 0, 0 100%, 30% 50%)",
            background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-1/2 h-1/3"
          style={{
            clipPath: "polygon(100% 100%, 0 100%, 100% 0, 70% 50%)",
            background: "linear-gradient(-45deg, #f093fb 0%, #f5576c 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                PhotoEdit Pro
              </h3>
            </div>
            <p className="text-slate-300 text-sm sm:text-base mb-6 max-w-md">
              Transform your photos into stunning profile pictures with our advanced AI technology. 
              Professional results in seconds, not hours.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors duration-200 group"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-200" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors duration-200 group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-200" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors duration-200 group"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-200" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#features" 
                  className="text-slate-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="#how-it-works" 
                  className="text-slate-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a 
                  href="#templates" 
                  className="text-slate-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Templates
                </a>
              </li>
              <li>
                <a 
                  href="#faq" 
                  className="text-slate-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-slate-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm text-center sm:text-left">
              © {currentYear} PhotoEdit Pro. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-pink-500 fill-current" />
              <span>for creators</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
