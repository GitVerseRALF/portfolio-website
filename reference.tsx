import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { NextPage } from 'next';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link: string;
  featured: boolean;
}

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string[];
}

const Home: NextPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');

  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const projects: Project[] = [
    {
      id: 1,
      title: 'Enterprise Analytics Platform',
      description: 'Real-time data visualization and analytics dashboard for Fortune 500 companies',
      tags: ['React', 'TypeScript', 'D3.js', 'Node.js'],
      link: '#',
      featured: true
    },
    {
      id: 2,
      title: 'AI-Powered Content Management',
      description: 'Machine learning driven CMS with automated content optimization',
      tags: ['Python', 'TensorFlow', 'React', 'AWS'],
      link: '#',
      featured: true
    },
    {
      id: 3,
      title: 'Blockchain Supply Chain',
      description: 'Decentralized supply chain management system using smart contracts',
      tags: ['Solidity', 'Web3.js', 'React', 'Node.js'],
      link: '#',
      featured: false
    },
    {
      id: 4,
      title: 'Mobile Banking Application',
      description: 'Secure mobile banking platform with biometric authentication',
      tags: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL'],
      link: '#',
      featured: false
    }
  ];

  const skills: Skill[] = [
    { name: 'React/Next.js', level: 95, category: 'frontend' },
    { name: 'TypeScript', level: 90, category: 'frontend' },
    { name: 'Node.js', level: 85, category: 'backend' },
    { name: 'Python', level: 80, category: 'backend' },
    { name: 'AWS/Cloud', level: 85, category: 'devops' },
    { name: 'Docker/K8s', level: 75, category: 'devops' },
    { name: 'UI/UX Design', level: 88, category: 'design' },
    { name: 'System Architecture', level: 92, category: 'design' }
  ];

  const experiences: Experience[] = [
    {
      id: 1,
      role: 'Senior Full Stack Engineer',
      company: 'Tech Innovations Inc.',
      period: '2021 - Present',
      description: [
        'Led development of microservices architecture serving 10M+ users',
        'Improved system performance by 40% through optimization algorithms',
        'Mentored team of 5 junior developers'
      ]
    },
    {
      id: 2,
      role: 'Full Stack Developer',
      company: 'Digital Solutions Ltd.',
      period: '2019 - 2021',
      description: [
        'Developed RESTful APIs and responsive web applications',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Collaborated with cross-functional teams in Agile environment'
      ]
    },
    {
      id: 3,
      role: 'Frontend Developer',
      company: 'Creative Agency',
      period: '2017 - 2019',
      description: [
        'Built interactive web experiences for major brands',
        'Optimized web performance achieving 95+ Lighthouse scores',
        'Introduced modern frontend practices and tooling'
      ]
    }
  ];

  const filterTags = ['all', 'React', 'TypeScript', 'Node.js', 'Python', 'AWS'];

  // Filtered projects algorithm
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter(project => 
      project.tags.some(tag => tag.toLowerCase().includes(activeFilter.toLowerCase()))
    );
  }, [activeFilter]);

  // Skill average calculation algorithm
  const skillAverage = useMemo(() => {
    const total = skills.reduce((acc, skill) => acc + skill.level, 0);
    return Math.round(total / skills.length);
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = [heroRef, aboutRef, projectsRef, experienceRef, contactRef];
    sections.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('Please fill in all fields.');
      return;
    }
    if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(formData.email)) {
      setFormStatus('Please enter a valid email address.');
      return;
    }
    setFormStatus('Thank you for your message. I will respond within 24 hours.');
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setFormStatus('');
    }, 3000);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Portfolio
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection(heroRef)} className="hover:text-blue-600 transition-colors">Home</button>
              <button onClick={() => scrollToSection(aboutRef)} className="hover:text-blue-600 transition-colors">About</button>
              <button onClick={() => scrollToSection(projectsRef)} className="hover:text-blue-600 transition-colors">Projects</button>
              <button onClick={() => scrollToSection(experienceRef)} className="hover:text-blue-600 transition-colors">Experience</button>
              <button onClick={() => scrollToSection(contactRef)} className="hover:text-blue-600 transition-colors">Contact</button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="space-y-1">
                <div className={`w-6 h-0.5 bg-gray-900 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <div className={`w-6 h-0.5 bg-gray-900 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <div className={`w-6 h-0.5 bg-gray-900 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => scrollToSection(heroRef)} className="block px-3 py-2 hover:bg-gray-100 w-full text-left">Home</button>
              <button onClick={() => scrollToSection(aboutRef)} className="block px-3 py-2 hover:bg-gray-100 w-full text-left">About</button>
              <button onClick={() => scrollToSection(projectsRef)} className="block px-3 py-2 hover:bg-gray-100 w-full text-left">Projects</button>
              <button onClick={() => scrollToSection(experienceRef)} className="block px-3 py-2 hover:bg-gray-100 w-full text-left">Experience</button>
              <button onClick={() => scrollToSection(contactRef)} className="block px-3 py-2 hover:bg-gray-100 w-full text-left">Contact</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section 
        ref={heroRef} 
        id="hero"
        className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-opacity duration-1000 ${visibleSections.has('hero') ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              John Doe
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">Senior Full Stack Engineer & System Architect</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => scrollToSection(projectsRef)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              View Projects
            </button>
            <button 
              onClick={() => scrollToSection(contactRef)}
              className="px-8 py-3 border-2 border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-all"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        ref={aboutRef} 
        id="about"
        className={`py-20 px-4 transition-all duration-1000 ${visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-lg text-gray-600 mb-6">
                With over 7 years of experience in full-stack development, I specialize in building scalable, 
                high-performance applications that solve complex business challenges. My expertise spans from 
                frontend frameworks to cloud infrastructure, with a passion for clean code and innovative solutions.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                I believe in continuous learning and staying at the forefront of technology trends. My approach 
                combines technical excellence with strategic thinking to deliver solutions that drive business value.
              </p>
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Overall Proficiency</h3>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-blue-600">{skillAverage}%</div>
                  <div className="ml-4 flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all"
                      style={{ width: `${skillAverage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Skills</h3>
              <div className="space-y-4">
                {skills.map(skill => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section 
        ref={projectsRef} 
        id="projects"
        className={`py-20 px-4 bg-white transition-all duration-1000 ${visibleSections.has('projects') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>
          <div className="flex justify-center mb-8 space-x-4 flex-wrap">
            {filterTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-4 py-2 rounded-full border transition-colors ${activeFilter === tag ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 hover:bg-blue-100'}`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <a 
                key={project.id} 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-transparent hover:border-blue-600"
              >
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section 
        ref={experienceRef} 
        id="experience"
        className={`py-20 px-4 transition-all duration-1000 ${visibleSections.has('experience') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Experience</h2>
          <div className="relative border-l-2 border-blue-600 pl-8">
            {experiences.map(exp => (
              <div key={exp.id} className="mb-12 relative">
                <div className="absolute -left-4 top-1 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                  {exp.id}
                </div>
                <h3 className="text-2xl font-semibold mb-1">{exp.role}</h3>
                <p className="text-blue-600 font-medium mb-1">{exp.company} | {exp.period}</p>
                <ul className="list-disc list-inside text-gray-700">
                  {exp.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        ref={contactRef} 
        id="contact"
        className={`py-20 px-4 bg-white transition-all duration-1000 ${visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Contact Me</h2>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 font-medium">Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 font-medium">Message</label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Send Message
            </button>
            {formStatus && <p className="mt-4 text-center text-blue-600 font-medium">{formStatus}</p>}
          </form>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} John Doe. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
