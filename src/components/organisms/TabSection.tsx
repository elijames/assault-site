import React, { useState, useEffect } from 'react';
import type { TabItem } from './types';

interface TabSectionProps {
  tabs: TabItem[];
}

export const TabSection: React.FC<TabSectionProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dinoLoaded, setDinoLoaded] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  
  console.log('Tabs data:', tabs);
  console.log('Active tab image:', tabs[activeTab]?.image);

  // Trigger dinosaur animation when tab changes
  useEffect(() => {
    // Hide dinosaur and chat bubble
    setDinoLoaded(false);
    setChatVisible(false);
    
    // Start dinosaur animation after a short delay
    const dinoTimer = setTimeout(() => setDinoLoaded(true), 100);
    
    // Start chat bubble container animation after dinosaur shake completes
    const chatTimer = setTimeout(() => setChatVisible(true), 700);
    
    // Start text animation after chat bubble container is visible
    const textTimer = setTimeout(() => setTextVisible(true), 1200);
    
    return () => {
      clearTimeout(dinoTimer);
      clearTimeout(chatTimer);
      clearTimeout(textTimer);
    };
  }, [activeTab]);

  const handleTabClick = (index: number) => {
    if (index === activeTab) return;
    
    setIsAnimating(true);
    
    // First fade out text
    setTextVisible(false);
    
    // Wait for text to fade out, then change content
    setTimeout(() => {
      setActiveTab(index);
      setTimeout(() => setIsAnimating(false), 100);
    }, 300);
  };

  const handleAccordionClick = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="w-full">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes dinoShake {
            0% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(-8px) rotate(-1deg); }
            50% { transform: translateX(8px) rotate(1deg); }
            75% { transform: translateX(-4px) rotate(-0.5deg); }
            100% { transform: translateX(0) rotate(0deg); }
          }
          .dino-shake {
            animation: dinoShake 0.6s ease-in-out;
          }
        `
      }} />

      {/* Desktop Tabs */}
      <div className="hidden lg:block">
        <div className="flex">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`px-6 py-3 text-lg font-medium font-secondary transition-colors duration-200 ${
                activeTab === index
                  ? 'text-gray-900 border-b-4 border-primary'
                  : 'text-gray-500 border-b-4 border-transparent hover:text-gray-700 hover:border-b-4 hover:border-primary'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="mt-8">
          {tabs[activeTab] && (
            <div className="flex gap-8 items-start">
              <div className="w-1/3">
                <img
                  src={tabs[activeTab].image}
                  alt={tabs[activeTab].title}
                  className={`w-full transition-all duration-300 ease-out ${
                    dinoLoaded ? 'dino-shake' : 'opacity-0'
                  }`}
                />
              </div>
              <div className={`w-2/3 lg:mt-[6rem] xl:mt-[8rem] 2xl:mt-[10rem] relative bg-white border-2 border-primary rounded-lg p-8 transition-all duration-500 ease-out origin-left flex-shrink-0 ${
                chatVisible 
                  ? 'opacity-100 transform translate-y-0 scale-100 rotate-0' 
                  : 'opacity-0 transform translate-y-4 scale-95 rotate-2'
              }`}>
                {/* Chat bubble pointer */}
                <div className="absolute top-4 -left-3 w-6 h-6 bg-white border-l-2 border-t-2 border-primary transform rotate-[-45deg]"></div>
                <h3 className={`text-2xl text-gray font-bold mb-4 transition-all duration-500 ease-out ${
                  textVisible 
                    ? 'opacity-100 transform translate-y-0 scale-100' 
                    : 'opacity-0 transform translate-y-4 scale-95'
                }`}>
                  {tabs[activeTab].title}
                </h3>
                <p className={`text-gray transition-all duration-500 ease-out delay-200 ${
                  textVisible 
                    ? 'opacity-100 transform translate-y-0 scale-100' 
                    : 'opacity-0 transform translate-y-4 scale-95'
                }`}>
                  {tabs[activeTab].content}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Accordion */}
      <div className="lg:hidden">
        {tabs.map((tab, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              onClick={() => handleAccordionClick(index)}
              className="w-full py-4 flex justify-between items-center text-left"
            >
              <span className="text-lg font-medium">{tab.title}</span>
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${
                  openAccordion === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openAccordion === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="pb-4">
                <p className="text-gray-700">{tab.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
