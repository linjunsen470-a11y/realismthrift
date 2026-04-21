"use client";

import React from "react";
import { Section } from "@/components/CommonUI";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pb-20">
      <div className="bg-gray-50 border-b border-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900">Get In Touch</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            Have questions about our products or process? Our team is here to help you scale your business.
          </p>
        </div>
      </div>

      <Section title="Contact Information" subtitle="Multiple ways to connect with our export specialists.">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-6 group hover:border-blue-500 transition-colors">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex-shrink-0 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Phone / WhatsApp</p>
                <p className="text-xl font-bold text-gray-900">+86 123 4567 8910</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-6 group hover:border-blue-500 transition-colors">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex-shrink-0 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Email Inquiry</p>
                <p className="text-xl font-bold text-gray-900">sales@realismthrift.com</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-6 group hover:border-blue-500 transition-colors">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex-shrink-0 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Office Location</p>
                <p className="text-xl font-bold text-gray-900">Guangzhou, China</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-10 rounded-3xl border border-gray-100 shadow-xl">
            <h3 className="text-2xl font-bold mb-8">Send us a message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-5 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select className="w-full px-5 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                  <option>Inquiry for Used Shoes</option>
                  <option>Inquiry for Used Clothes</option>
                  <option>Inquiry for Used Bags</option>
                  <option>Other / General Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-5 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Tell us about your requirements..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 text-lg"
              >
                <Send size={20} /> Send Inquiry Now
              </button>
            </form>
          </div>
        </div>
      </Section>
    </div>
  );
}
