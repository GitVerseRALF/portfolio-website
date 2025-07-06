import React, { useState } from 'react';
import { Code, Shield, Globe, Terminal, Lock, Server, Database, Wrench, BookOpen, Cpu, Network } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
}

interface SubCategory {
  name: string;
  icon: React.ReactNode;
  skills: Skill[];
}

interface Category {
  name: string;
  icon: React.ReactNode;
  color: string;
  subCategories: SubCategory[];
}

const PortfolioHardSkills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('website');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('programming');

  const categories: Category[] = [
    {
      name: 'Website Development',
      icon: <Globe className="w-6 h-6" />,
      color: 'blue',
      subCategories: [
        {
          name: 'Programming Languages',
          icon: <Code className="w-5 h-5" />,
          skills: [
            { name: 'JavaScript', level: 90 },
            { name: 'TypeScript', level: 85 },
            { name: 'Python', level: 80 },
            { name: 'PHP', level: 75 },
            { name: 'Java', level: 70 }
          ]
        },
        {
          name: 'Frameworks & Libraries',
          icon: <Cpu className="w-5 h-5" />,
          skills: [
            { name: 'React', level: 90 },
            { name: 'Next.js', level: 85 },
            { name: 'Vue.js', level: 75 },
            { name: 'Express.js', level: 80 },
            { name: 'Django', level: 70 }
          ]
        },
        {
          name: 'Tools & Technologies',
          icon: <Wrench className="w-5 h-5" />,
          skills: [
            { name: 'Git', level: 90 },
            { name: 'Docker', level: 80 },
            { name: 'Webpack', level: 75 },
            { name: 'VS Code', level: 95 },
            { name: 'Postman', level: 85 }
          ]
        },
        {
          name: 'Databases',
          icon: <Database className="w-5 h-5" />,
          skills: [
            { name: 'MongoDB', level: 85 },
            { name: 'PostgreSQL', level: 80 },
            { name: 'MySQL', level: 75 },
            { name: 'Redis', level: 70 },
            { name: 'Firebase', level: 80 }
          ]
        }
      ]
    },
    {
      name: 'Cybersecurity',
      icon: <Shield className="w-6 h-6" />,
      color: 'red',
      subCategories: [
        {
          name: 'Programming Languages',
          icon: <Code className="w-5 h-5" />,
          skills: [
            { name: 'Python', level: 90 },
            { name: 'C/C++', level: 75 },
            { name: 'Bash', level: 85 },
            { name: 'PowerShell', level: 70 },
            { name: 'Assembly', level: 60 }
          ]
        },
        {
          name: 'Security Tools',
          icon: <Lock className="w-5 h-5" />,
          skills: [
            { name: 'Metasploit', level: 85 },
            { name: 'Nmap', level: 90 },
            { name: 'Wireshark', level: 85 },
            { name: 'Burp Suite', level: 80 },
            { name: 'John the Ripper', level: 75 }
          ]
        },
        {
          name: 'Platforms & OS',
          icon: <Server className="w-5 h-5" />,
          skills: [
            { name: 'Kali Linux', level: 90 },
            { name: 'Ubuntu Server', level: 85 },
            { name: 'Windows Server', level: 75 },
            { name: 'CentOS', level: 70 },
            { name: 'Parrot OS', level: 80 }
          ]
        },
        {
          name: 'Security Concepts',
          icon: <BookOpen className="w-5 h-5" />,
          skills: [
            { name: 'Penetration Testing', level: 85 },
            { name: 'Network Security', level: 80 },
            { name: 'Cryptography', level: 75 },
            { name: 'OWASP Top 10', level: 90 },
            { name: 'Incident Response', level: 70 }
          ]
        }
      ]
    }
  ];

  const currentCategory = categories.find(cat => 
    cat.name.toLowerCase().includes(activeCategory)
  );

  const currentSubCategory = currentCategory?.subCategories.find(sub => 
    sub.name.toLowerCase().includes(activeSubCategory)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Technical Skills Portfolio
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Explore my expertise in Website Development and Cybersecurity
        </p>

        {/* Category Selection */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          {categories.map((category) => {
            const catKey = category.name.toLowerCase().includes('website') ? 'website' : 'cybersecurity';
            return (
              <button
                key={category.name}
                onClick={() => {
                  setActiveCategory(catKey);
                  setActiveSubCategory('programming');
                }}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === catKey
                    ? category.color === 'blue'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
                }`}
              >
                {category.icon}
                <span className="font-semibold">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Subcategory Tabs */}
        {currentCategory && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-wrap gap-3 mb-6">
              {currentCategory.subCategories.map((subCategory) => {
                const subKey = subCategory.name.toLowerCase().split(' ')[0];
                return (
                  <button
                    key={subCategory.name}
                    onClick={() => setActiveSubCategory(subKey)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeSubCategory === subKey
                        ? activeCategory === 'website'
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : 'bg-red-100 text-red-700 border-2 border-red-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                    }`}
                  >
                    {subCategory.icon}
                    <span className="font-medium">{subCategory.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Skills Display */}
            {currentSubCategory && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {currentSubCategory.name}
                </h3>
                {currentSubCategory.skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          activeCategory === 'website'
                            ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                            : 'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Network className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Web Development Focus</h3>
            </div>
            <p className="text-gray-600">
              Specializing in modern web technologies, responsive design, and scalable applications
              with a focus on user experience and performance optimization.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-800">Security Expertise</h3>
            </div>
            <p className="text-gray-600">
              Proficient in vulnerability assessment, penetration testing, and implementing
              security best practices to protect digital assets and infrastructure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHardSkills;
