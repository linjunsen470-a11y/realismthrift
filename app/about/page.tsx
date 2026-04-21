"use client";

import React from "react";
import Image from "next/image";
import { Section } from "@/components/CommonUI";
import { Users, Globe, Recycle, Award } from "lucide-react";

const stats = [
  { icon: Users, label: "Happy Clients", value: "500+" },
  { icon: Globe, label: "Countries Served", value: "50+" },
  { icon: Recycle, label: "Tons Recycled", value: "10k+" },
  { icon: Award, label: "Years Experience", value: "10+" },
];

export default function AboutPage() {
  return (
    <div className="pb-20">
      <div className="bg-gray-900 py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/img/about-hero.jpg"
            alt="About"
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">About Realism Thrift</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Building sustainable bridges between Chinese quality and global thrift markets.
          </p>
        </div>
      </div>

      <Section title="Our Mission" subtitle="Sustainable fashion for a better world.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">Pioneers in Used Goods Export</h3>
            <p className="text-lg text-gray-600 leading-relaxed font-light">
              Realism Thrift started with a simple vision: to give high-quality used items a second life where they are needed most. Based in Guangzhou, the heart of China&apos;s logistics hubs, we have grown into a premier exporter of graded second-hand goods.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-light">
              We understand the complexities of international trade. Our rigorous sorting process and dedicated quality control team ensure that every bale we pack meets the standard our clients expect for their local markets.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-gray-50 p-8 rounded-3xl text-center border border-gray-100">
                <stat.icon className="mx-auto mb-4 text-blue-600" size={32} />
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Our Core Values" dark>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Award size={32} />
            </div>
            <h4 className="text-xl font-bold mb-3">Integrity</h4>
            <p className="text-gray-500 font-light">We believe in transparent grading and honest business practices in every transaction.</p>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Recycle size={32} />
            </div>
            <h4 className="text-xl font-bold mb-3">Sustainability</h4>
            <p className="text-gray-500 font-light">Reducing textile waste by extending the lifecycle of fashion goods globally.</p>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe size={32} />
            </div>
            <h4 className="text-xl font-bold mb-3">Reliability</h4>
            <p className="text-gray-500 font-light">Consistent supply and timely deliveries to keep your business running smoothly.</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
