import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaCode, FaDatabase, FaServer, FaMobile, FaBars, FaTimes, FaCog, FaMemory, FaShieldAlt, FaBug, FaTerminal, FaKey, FaUserSecret, FaNetworkWired, FaSearch, FaRedo } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from "react-google-recaptcha";

type Skill = {
  name: string;
  level: number;
  category: string;
  subCategory: string;
  icon: JSX.Element;
};

type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link: string;
  image?: string;
  category: 'web' | 'mobile' | 'design' | 'other' | 'security' | 'forensics' | 'pentesting' | 'malware' | 'cybersecurity' | 'reverse-engineering' | 'memory-management' | 'data-visualization';
};

type Experience = {
  company: string;
  position: string;
  duration: string;
  responsibilities: string[];
};

const Terminal = dynamic(() => import('../components/Terminal'), { ssr: false });

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [captchaValue, setCaptchaValue] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [isValidCaptcha, setIsValidCaptcha] = useState(false);
  const [formStatus, setFormStatus] = useState<null | 'success' | 'error'>(null);
  const [skillsFilter, setSkillsFilter] = useState('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState('all');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const sections = ['home', 'about', 'resume', 'skills', 'projects', 'terminal', 'contact'];
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({
    home: null,
    about: null,
    resume: null,
    skills: null,
    projects: null,
    contact: null,
    terminal: null,
  });

  const skillCategories = {
    web: {
      name: 'Web Development',
      subCategories: ['Frontend', 'Backend', 'Database', 'Framework', 'Style', 'Markup', 'Library', 'Runtime']
    },
    cybersecurity: {
      name: 'Cybersecurity',
      subCategories: [
        'Security Tools',
        'Network Analysis',
        'Network Scanning',
        'Web Security',
        'Malware Analysis',
        'Data Analysis',
        'Password Cracking',
        'Penetration Testing',
        'Digital Forensics'
      ]
    },
    'reverse-engineering': {
      name: 'Reverse Engineering',
      subCategories: ['Tool', 'Language']
    }
  };

  const skillsData: Skill[] = [
    { name: 'HTML', level: 90, category: 'web', subCategory: 'Markup', icon: <FaCode /> },
    { name: 'CSS', level: 90, category: 'web', subCategory: 'Style', icon: <FaCode /> },
    { name: 'JavaScript', level: 75, category: 'web', subCategory: 'Frontend', icon: <FaCode /> },
    { name: 'React', level: 65, category: 'web', subCategory: 'Library', icon: <FaCode /> },
    { name: 'TypeScript', level: 70, category: 'web', subCategory: 'Frontend', icon: <FaCode /> },
    { name: 'Next.js', level: 80, category: 'web', subCategory: 'Framework', icon: <FaCode /> },
    { name: 'PHP', level: 75, category: 'web', subCategory: 'Backend', icon: <FaCode /> },
    { name: 'Tailwind CSS', level: 75, category: 'web', subCategory: 'Style', icon: <FaCode /> },
    { name: 'Bootstrap', level: 75, category: 'web', subCategory: 'Framework', icon: <FaCode /> },
    { name: 'Node.js', level: 80, category: 'web', subCategory: 'Runtime', icon: <FaServer /> },

    // Cybersecurity
    { name: 'Wireshark', level: 60, category: 'cybersecurity', subCategory: 'Network Analysis', icon: <FaNetworkWired /> },
    { name: 'Nmap', level: 75, category: 'cybersecurity', subCategory: 'Network Scanning', icon: <FaNetworkWired /> },
    { name: 'Burp Suite', level: 50, category: 'cybersecurity', subCategory: 'Web Security', icon: <FaShieldAlt /> },
    { name: 'VirusTotal', level: 75, category: 'cybersecurity', subCategory: 'Malware Analysis', icon: <FaShieldAlt /> },
    { name: 'Splunk', level: 75, category: 'cybersecurity', subCategory: 'Data Analysis', icon: <FaSearch /> },
    { name: 'JohntheRipper', level: 60, category: 'cybersecurity', subCategory: 'Password Cracking', icon: <FaKey /> },
    { name: 'Metasploit', level: 30, category: 'cybersecurity', subCategory: 'Penetration Testing', icon: <FaTerminal /> },
    { name: 'Autopsy', level: 80, category: 'cybersecurity', subCategory: 'Digital Forensics', icon: <FaUserSecret /> },

    // Reverse Engineering
    { name: 'Cheat Engine', level: 40, category: 'reverse-engineering', subCategory: 'Tool', icon: <FaCog /> },
    { name: 'Assembly x86-64', level: 10, category: 'reverse-engineering', subCategory: 'Language', icon: <FaBug /> },
    { name: 'Debugger x64dbg', level: 20, category: 'reverse-engineering', subCategory: 'Tool', icon: <FaBug /> },

    // Mobile
    { name: 'Java', level: 70, category: 'mobile', subCategory: 'Programming', icon: <FaMobile /> },

    // Database
    { name: 'MongoDB', level: 85, category: 'web', subCategory: 'Database', icon: <FaDatabase /> },
    { name: 'SQL', level: 70, category: 'web', subCategory: 'Database', icon: <FaDatabase /> },

    // Tools
    { name: 'Git', level: 85, category: 'tool', subCategory: 'Version Control', icon: <FaCode /> },
  ];

  const projectsData: Project[] = [
    {
      id: 1,
      title: 'Career Compass',
      description: 'An App that helps users find jobs based on their personality and skills, using psychological method queries for precise job matching.',
      tags: ['Project Management', 'Programming', 'Psychology', 'Job Matching'],
      link: 'https://github.com/GitVerseRALF/Career_Compass',
      category: 'web',
      image: '/images/Career Compass.png'
    },
    {
      id: 2,
      title: 'Crime Dashboard',
      description: 'A Crime Visualization dashboard with AI integration featuring Anomaly Detection, Cluster Analysis, Pattern Analysis Heatmap, and Precision Analysis F1-Score.',
      tags: ['AI', 'Data Visualization', 'Analytics', 'Python'],
      link: 'https://github.com/GitVerseRALF/Crime-Analytics-Dashboard',
      category: 'cybersecurity',
      image: '/images/streamlit-logo-secondary-colormark-darktext.svg'
    },
    {
      id: 3,
      title: 'Security Risk Management',
      description: 'A centralized platform for security professionals to track projects, manage assets, perform VirusTotal scans, and maintain security assessments.',
      tags: ['Security', 'Risk Management', 'VirusTotal', 'Asset Management'],
      link: 'https://drive.google.com/drive/folders/1GjfmwPk6AyfB45pOcs0CXEz32YaJt4Ml?usp=sharing',
      category: 'cybersecurity',
      image: '/images/Virustotal.jpg'
    },
    {
      id: 4,
      title: 'Digital Forensic Autopsy',
      description: 'Investigation of "Operation Rembrandt Ruse" and "Miami" Disc File cases using digital forensic techniques.',
      tags: ['Digital Forensics', 'Investigation', 'Cybersecurity'],
      link: 'https://github.com/yourusername/digital-forensics',
      category: 'forensics',
      image: '/images/Autopsy-digital.jpg'
    },
    {
      id: 5,
      title: 'Network Configuration Project',
      description: 'A Topology of LAN configuration for 4 Departments across 2 floors and 2 buildings, implemented using Cisco CLI.',
      tags: ['Cisco', 'Networking', 'CLI', 'LAN'],
      link: 'https://github.com/GitVerseRALF/Cisco-Project',
      category: 'cybersecurity',
      image: '/images/cisco.svg'
    },
    {
      id: 6,
      title: 'EZ Shop',
      description: 'Java-based E-Commerce Android application with modern shopping features.',
      tags: ['Java', 'Android Studio', 'E-Commerce', 'Mobile Development'],
      link: 'https://drive.google.com/drive/folders/1vPEm1K98hLc6QFs7JWT7egdf_ISCa9E1?hl=ID',
      category: 'mobile',
      image: '/images/java.svg'
    },
    {
      id: 7,
      title: 'Course Enrollment System',
      description: 'Web-based course enrollment platform with integrated database functionality.',
      tags: ['Web Development', 'Database', 'Education'],
      link: 'https://github.com/GitVerseRALF/Server-Side-Internet-Programming',
      category: 'web',
      image: '/images/phpmyadmin.svg'
    },
    {
      id: 8,
      title: 'BMI Health Checker',
      description: 'Application for BMI calculation with personalized health insights and recommendations.',
      tags: ['Health', 'Analytics', 'User Interface'],
      link: 'https://github.com/GitVerseRALF/BMI-Tracker',
      category: 'web',
      image: '/images/java.svg'
    },
    {
      id: 9,
      title: 'Coffee Shop',
      description: 'A website for users to order and buy coffee online.',
      tags: ['E-Commerce', 'Web', 'Coffee'],
      link: 'https://github.com/GitVerseRALF/Coffee-Shop',
      category: 'web',
      image: '/images/html5.svg'
    },
    {
      id: 10,
      title: 'Nobar',
      description: 'A movie reservation web-based application for booking movie tickets.',
      tags: ['Web', 'Movie', 'Reservation'],
      link: 'https://github.com/GitVerseRALF/Nobar',
      category: 'web',
      image: '/images/html5.svg'
    },
    {
      id: 11,
      title: 'Going to the Gym',
      description: 'A Blender project representing a 2 person going and doing workout, with lowpoly and keyframe animation.',
      tags: ['Blender', 'Animation', 'Design'],
      link: 'https://drive.google.com/drive/folders/1WQkQGaFZnahMLnJLTqTyP_i0Mg4Hn72S?hl=ID',
      category: 'design',
      image: '/images/blender.svg'
    },
    {
      id: 12,
      title: 'Rice Import Prediction based Diagram',
      description: 'A Python program to create a diagram and let users see prediction results and errors.',
      tags: ['Python', 'Visualization', 'Prediction'],
      link: 'https://github.com/GitVerseRALF/python-data-analysis-numerical-methods',
      category: 'web',
      image: '/images/python.svg'
    },
    {
      id: 13,
      title: 'Human Trafficking Case of Daniel Vega',
      description: 'Digital forensic autopsy: creating a timeline and evidence discoveries for a murder case.',
      tags: ['Forensics', 'Investigation', 'Autopsy'],
      link: 'https://github.com/yourusername/daniel-vega-case',
      category: 'forensics',
      image: '/images/Autopsy-digital.jpg'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = sectionRefs.current[section];
        if (!element) continue;

        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(section);
          break;
        }
      }
    };

    

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (section: string) => {
    setIsMenuOpen(false);
    const element = sectionRefs.current[section];
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 70,
        behavior: 'smooth',
      });
    }
  };

  const filteredProjects = filterCategory === 'all'
    ? projectsData
    : projectsData.filter(project => project.category === filterCategory);

  const filteredSkills = skillsData.filter(skill => {
    if (skillsFilter === 'all') return true;
    if (subCategoryFilter === 'all') return skill.category === skillsFilter;
    return skill.category === skillsFilter && skill.subCategory === subCategoryFilter;
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidCaptcha) {
      setFormStatus('error');
      return;
    }

    try {
      setFormStatus(null);

      const result = await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        }
      );

      console.log('SUCCESS!', result.status, result.text);

      if (result.status === 200) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
        generateCaptcha();
        setTimeout(() => setFormStatus(null), 3000);
      }
    } catch (error) {
      console.error('FAILED...', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 3000);
    }
  };

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(captcha);
    setUserCaptchaInput('');
    setIsValidCaptcha(false);
  };

  const NavLink = ({ section }: { section: string }) => (
    <button
      onClick={() => scrollToSection(section)}
      className={`capitalize px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out 
                  ${activeSection === section 
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'}`}
    >
      {section}
    </button>
  );

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <>
      <Head>
        <title>Rafata Alfatih - Cybersecurity Specialist</title>
        <meta name="description" content="Rafata Alfatih professional portfolio showcasing skills, projects, and experience as a Senior Software Engineer." />
        <meta name="keywords" content="portfolio, software engineer, web developer, react, nextjs, typescript, nodejs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-indigo-100 text-gray-800 font-sans antialiased">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-indigo-700 cursor-pointer"
                onClick={() => scrollToSection('home')}
              >
                Rafata Alfatih
              </motion.div>
              
              <div className="hidden md:flex space-x-2">
                {sections.map((section) => (
                  <NavLink key={section} section={section} />
                ))}
              </div>
              
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-700 hover:text-indigo-600 focus:outline-none p-2 rounded-md transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden bg-white border-t border-gray-200 shadow-lg"
              >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {sections.map((section) => (
                    <button
                      key={section}
                      onClick={() => scrollToSection(section)}
                      className={`block w-full text-left capitalize px-3 py-2 rounded-md text-base font-medium 
                                  ${activeSection === section 
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'}`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Home Section */}
        <section 
          ref={(el) => { sectionRefs.current.home = el as HTMLDivElement | null; }}
          id="home"
          className="min-h-screen flex items-center justify-center pt-24 pb-16 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-bg.svg)' }} // Subtle background pattern
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <div className="relative inline-block mb-8">
                <img 
                  src="/images/profile-photo.svg" // Placeholder for profile photo
                  alt="Rafata Alfatih" 
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shadow-xl border-4 border-white mx-auto"
                />
                <motion.div 
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                >
                  <FaCode className="w-6 h-6" />
                </motion.div>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-gray-900">
                Hi, I&apos;m <span className="text-indigo-600">Rafata Alfatih</span>
              </h1>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-gray-700">
                Cybersecurity Specialist & Cyber Deconstructor
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Breaking down barriers between security and innovation, I decode, analyze, and reconstruct digital ecosystems. My expertise in cybersecurity and reverse engineering turns threats into knowledge, fortifying systems against ever-evolving cyber risks.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(99, 102, 241, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('contact')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Get in Touch
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('projects')}
                  className="bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  View My Work
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section 
          ref={(el) => { sectionRefs.current.about = el as HTMLDivElement | null; }}
          id="about"
          className="py-20 bg-white shadow-inner"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="section-title text-gray-900">About Me</h2>
              <div className="section-subtitle"></div>
              
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <motion.div 
                  className="lg:w-1/3 relative"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-2xl p-1.5">
                     <img 
                        src="/images/about-me-image.jpg" // Placeholder for a professional/casual photo
                        alt="Rafata Alfatih - About Me" 
                        className="w-full h-full object-cover rounded-md"
                      />
                  </div>
                   <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-300 rounded-full opacity-50 -z-10"></div>
                   <div className="absolute -top-4 -left-4 w-16 h-16 bg-pink-300 rounded-lg opacity-50 -z-10 transform rotate-12"></div>
                </motion.div>
                
                <div className="lg:w-2/3">
                  <h3 className="text-2xl font-semibold mb-6 text-indigo-700">My Journey in Tech</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                    From my first security audit to deconstructing sophisticated cyber threats, my passion for safeguarding technology has been a driving force. I thrive on challenges, continuously analyze risks, and believe in the power of collaboration to build resilient security frameworks. My expertise spans the full cybersecurity lifecycle, from threat identification and system hardening to incident response and forensic analysis.
                  </p>
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                    Beyond penetration testing, I'm an advocate for zero-trust architectures, a proponent of ethical hacking, and always curious about emerging security trends that redefine digital defense strategies.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <InfoCard title="Education" content="MSc in Computer Science, University of President" />
                    <InfoCard title="Experience" content="2 Years as a Software Developers, 2 month worth of Cybersecurity 101, Lead Developer at Innovate Features" />
                    <InfoCard title="Core Philosophy" content="Build for impact, design for users, code for maintainability." />
                    <InfoCard title="Interests" content="Open Source, AI Ethics, Analyzing, Theorize, Deep-Exploring" />
                  </div>

                  <div className="flex space-x-6 text-3xl text-indigo-600">
                    <SocialLink href="https://github.com/GitVerseRALF?tab=repositories" icon={<FaGithub />} label="GitHub" />
                    <SocialLink href="https://www.linkedin.com/in/rafata-alfatih-a1707a28b" icon={<FaLinkedin />} label="LinkedIn" />
                    <SocialLink href="https://www.instagram.com/rafataalfatih/?next=%2F" icon={<FaInstagram />} label="Instagram" />
                    <SocialLink href="mailto:your.email@example.com" icon={<FaEnvelope />} label="Email" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Resume Section */}
        <section 
          ref={(el) => { sectionRefs.current.resume = el }}
          id="resume"
          className="py-20 bg-gray-50"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="section-title text-gray-900">Resume</h2>
              <div className="section-subtitle"></div>

              {/* Header/Personal Info */}
              <div className="max-w-4xl mx-auto mb-12 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">RAFATA ALFATIH</h1>
                {/* <p className="text-gray-600 mb-2">Perumahan Bintang Alam, Blok Q2 No. 6, RT.40/RW.11, Teluk Jambe Timur</p> */}
                {/* <p className="text-gray-600 mb-2">Karawang, Jawa Barat, ID 41361</p> */}
                <div className="flex justify-center space-x-4">
                  <a href="mailto:rafataalfatih55@gmail.com" className="text-indigo-600 hover:text-indigo-800 flex items-center">
                    <FaEnvelope className="mr-2" /> rafataalfatih55@gmail.com
                  </a>
                </div>
              </div>

              {/* Education Section */}
              <div className="max-w-4xl mx-auto mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Education</h3>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h4 className="text-xl font-semibold text-gray-800">Bachelor of Science in Computing</h4>
                    <p className="text-indigo-600">PRESIDENT UNIVERSITY</p>
                    <p className="text-gray-600">Sep 2023 - Present</p>
                    <p className="mt-2 text-gray-600">GPA 3.80 / 4.00</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h4 className="text-xl font-semibold text-gray-800">High School Diploma</h4>
                    <p className="text-indigo-600">SMAN 1 KARAWANG</p>
                    <p className="text-gray-600">Jun 2020 - May 2023</p>
                  </div>
                </div>
              </div>

              {/* Experience Section */}
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Work Experience</h3>
                <div className="space-y-8">
                  {/* TATA */}
                  <div className="relative border-l-2 border-indigo-600 pl-8 pb-8">
                    <div className="absolute -left-4 top-0 bg-indigo-600 rounded-full w-6 h-6"></div>
                    <h4 className="text-xl font-semibold text-gray-800">Cybersecurity Analyst</h4>
                    <p className="text-indigo-600 font-medium">TATA, Mumbai | Jun 2025 - Jun 2025</p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Identity and access management (IAM) for Tata Consultancy Services, collaborating with a Cybersecurity Consulting team</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Acquired expertise in IAM principles, cybersecurity best practices, and strategic alignment with business objectives</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Delivered comprehensive documentation and presentations, showcasing the ability to communicate complex technical concepts effectively</span>
                      </li>
                    </ul>
                  </div>

                  {/* Datacom */}
                  <div className="relative border-l-2 border-indigo-600 pl-8 pb-8">
                    <div className="absolute -left-4 top-0 bg-indigo-600 rounded-full w-6 h-6"></div>
                    <h4 className="text-xl font-semibold text-gray-800">Cybersecurity Consultant</h4>
                    <p className="text-indigo-600 font-medium">Datacom, New Zealand | Jun 2025 - Jun 2025</p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Completed a simulation focussed on how Datacom's cybersecurity team helps protect it's clients</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Investigated a cyberattack and produced a comprehensive report documenting findings</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Conducted a comprehensive risk assessment</span>
                      </li>
                    </ul>
                  </div>

                  {/* Deloitte */}
                  <div className="relative border-l-2 border-indigo-600 pl-8 pb-8">
                    <div className="absolute -left-4 top-0 bg-indigo-600 rounded-full w-6 h-6"></div>
                    <h4 className="text-xl font-semibold text-gray-800">Security Operations Center (SOC) Analyst</h4>
                    <p className="text-indigo-600 font-medium">Deloitte, Australia | Jun 2025 - Jun 2025</p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Reading web activity logs</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Supported a client in a cyber security breach</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Answered questions to identify suspicious user activity</span>
                      </li>
                    </ul>
                  </div>

                  {/* Telstra */}
                  <div className="relative border-l-2 border-indigo-600 pl-8 pb-8">
                    <div className="absolute -left-4 top-0 bg-indigo-600 rounded-full w-6 h-6"></div>
                    <h4 className="text-xl font-semibold text-gray-800">Cybersecurity Architect</h4>
                    <p className="text-indigo-600 font-medium">Telstra, New York | Jun 2025 - Jun 2025</p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Responding to malware attack, analyzing the attack</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Technical mitigation of malware attack</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Incident postmortem analysis</span>
                      </li>
                    </ul>
                  </div>

                  {/* AIG */}
                  <div className="relative border-l-2 border-indigo-600 pl-8 pb-8">
                    <div className="absolute -left-4 top-0 bg-indigo-600 rounded-full w-6 h-6"></div>
                    <h4 className="text-xl font-semibold text-gray-800">Cybersecurity Analyst</h4>
                    <p className="text-indigo-600 font-medium">AIG - Shields Up, New York | Jun 2025 - Jun 2025</p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Researched and understood reported vulnerabilities, showcasing analytical skills in cybersecurity</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Drafted clear and concise email to guide teams on vulnerability remediation</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Utilized Python skills to write scripts for ethical hacking, avoiding ransom payments by bruteforcing decryption keys</span>
                      </li>
                    </ul>
                  </div>

                  {/* Mastercard */}
                  <div className="relative border-l-2 border-indigo-600 pl-8 pb-8">
                    <div className="absolute -left-4 top-0 bg-indigo-600 rounded-full w-6 h-6"></div>
                    <h4 className="text-xl font-semibold text-gray-800">Cybersecurity Analyst</h4>
                    <p className="text-indigo-600 font-medium">Mastercard, New York | Jun 2025 - Jun 2025</p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Served as an analyst on Mastercard's Security Awareness Team</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Helped identify and report security threats such as phishing</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Analyzed and identified areas needing more robust security training and implemented training courses</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Skills & Certificates Section */}
              <div className="max-w-4xl mx-auto mt-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Skills & Certificates</h3>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Skills</h4>
                    <p className="text-gray-600">Cybersecurity 101, Database System Management, Software Development</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Certificates</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>UI/UX Competition (COMPSPHERE)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Internship & Job Preparation (Wiwin Widianingsih, S.H., LL.M.)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Workshop Leveraging the Power of Machine Learning (COMPSPHERE)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>HackFinity Battle (TryHackMe)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Digital Talent Scholarship - Cloud and AI (Score: 93.84%)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Datacom - Cybersecurity Job Simulation (Forage)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>AIG Shields Up: Cybersecurity Job Simulation (Forage)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                        <span>Mastercard - Cybersecurity Job Simulation (Forage)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Language Proficiencies Section */}
              <div className="max-w-4xl mx-auto mt-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Language Proficiencies</h3>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <p className="text-gray-600">English (Intermediate) / Cambridge English (Score: 145)</p>
                </div>
              </div>

              {/* Personal Section */}
              <div className="max-w-4xl mx-auto mt-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Summary</h3>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    A proactive Cybersecurity undergraduate with a strong foundation in secure software development. 
                    Demonstrates practical expertise through extensive job simulations, excelling in incident response 
                    by analyzing malware attacks, conducting vulnerability triage, and performing ethical hacking with Python. 
                    Adept at utilizing security tools like Nmap, Wireshark, Splunk, and Burp Suite for network analysis 
                    and threat identification. Proven skills in Identity and Access Management (IAM) and risk assessment, 
                    eager to apply a unique blend of development and defensive security knowledge to solve complex, 
                    real-world cybersecurity challenges.
                  </p>
                </div>
              </div>

              {/* Download CV & Resume Buttons */}
              <div className="max-w-4xl mx-auto mt-12 flex flex-col sm:flex-row justify-center gap-6">
                <a
                  href="/CV2.pdf"
                  download
                  className="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition text-center"
                >
                  Download CV
                </a>
                <a
                  href="/Resume.pdf"
                  download
                  className="inline-block px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow hover:bg-yellow-500 transition text-center"
                >
                  Download Resume
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section 
          ref={(el) => { sectionRefs.current.skills = el as HTMLDivElement | null; }}
          id="skills"
          className="py-20 bg-gray-50"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="section-title text-gray-900">My Collection of Hard Skills</h2>
              <div className="section-subtitle"></div>

              <div className="space-y-8">
                {/* Main Category Filters */}
                <div className="flex justify-center flex-wrap gap-3 mb-10">
                  {['all', 'web', 'cybersecurity', 'reverse-engineering'].map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSkillsFilter(category);
                        setSubCategoryFilter('all');
                      }}
                      className={`capitalize px-5 py-2 rounded-full border-2 text-sm font-medium transition-all duration-300 ease-in-out 
                                  ${skillsFilter === category 
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                    : 'bg-white text-indigo-600 border-indigo-500 hover:bg-indigo-50 hover:shadow-sm'}`}
                    >
                      {category.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                {/* Sub Category Filters - Only show if a main category is selected */}
                {skillsFilter !== 'all' && (
                  <div className="flex justify-center flex-wrap gap-3 mb-10">
                    <button
                      onClick={() => setSubCategoryFilter('all')}
                      className={`px-4 py-2 rounded-lg transition-all duration-200
                        ${subCategoryFilter === 'all'
                          ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'}`}
                    >
                      All
                    </button>
                    {skillCategories[skillsFilter as keyof typeof skillCategories]?.subCategories.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setSubCategoryFilter(sub)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200
                          ${subCategoryFilter === sub
                            ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'}`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}

                {/* Skills Grid - Your existing grid code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredSkills.map((skill, index) => (
                    <motion.div 
                      key={skill.name}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true, amount: 0.5 }}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="text-indigo-600 text-3xl p-2 bg-indigo-100 rounded-full">{skill.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-800">{skill.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-1 capitalize">Category: {skill.category}</p>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1.2, ease: "circOut" }}
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full"
                        />
                      </div>
                      <p className="text-right text-sm text-indigo-700 font-medium">{skill.level}%</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section 
          ref={(el) => { sectionRefs.current.projects = el as HTMLDivElement | null; }}
          id="projects"
          className="py-20 bg-white shadow-inner"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="section-title text-gray-900">Featured Projects</h2>
              <div className="section-subtitle"></div>

              <div className="flex justify-center flex-wrap gap-3 mb-10">
                {[
                  'all',
                  'forensics',
                  'web',
                  'mobile',
                  'design',
                ].map(category => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`capitalize px-5 py-2 rounded-full border-2 text-sm font-medium transition-all duration-300 ease-in-out 
                                ${filterCategory === category 
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                  : 'bg-white text-indigo-600 border-indigo-500 hover:bg-indigo-50 hover:shadow-sm'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={filterCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className="bg-gray-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-200 group"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      {project.image && (
                        <div className="relative h-56 w-full overflow-hidden">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold mb-3 text-indigo-700 group-hover:text-indigo-800 transition-colors duration-300">{project.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{project.description}</p>
                        <div className="mt-auto">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map(tag => (
                              <span key={tag} className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            View Project
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Terminal Section */}
        <section 
          ref={(el) => { sectionRefs.current.terminal = el as HTMLDivElement | null; }}
          id="terminal"
          className="py-20 bg-gray-900"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="section-title text-white">Interactive Terminal</h2>
              <div className="section-subtitle bg-white"></div>
              <p className="text-center text-gray-300 mb-10">
                Explore my portfolio through the command line
              </p>
              <Terminal />
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
          ref={(el) => { sectionRefs.current.contact = el as HTMLDivElement | null; }}
          id="contact"
          className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="section-title text-white">Let&apos;s Connect</h2>
              <div className="w-20 h-1 bg-yellow-300 mx-auto mb-10"></div>
              <p className="text-center text-indigo-100 text-lg mb-10">
                Have a project in mind, a question, or just want to say hi? Feel free to reach out!
              </p>

              <form 
                ref={formRef}
                onSubmit={handleFormSubmit} 
                className="space-y-6 bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-2xl"
              >
                <div>
                  <label htmlFor="name" className="block text-indigo-50 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name" // <-- must match EmailJS variable
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-indigo-300/50 rounded-md text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition-all duration-300"
                    placeholder="e.g. Jane Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-indigo-50 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email" // <-- must match EmailJS variable
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-indigo-300/50 rounded-md text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition-all duration-300"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-indigo-50 font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message" // <-- must match EmailJS variable
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/20 border border-indigo-300/50 rounded-md text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition-all duration-300"
                    placeholder="Your message here..."
                  />
                </div>

                {/* Custom Captcha */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white/20 p-4 rounded-lg">
                    <div className="font-mono text-xl tracking-wider text-white select-none 
                                    bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 rounded">
                      {captchaValue}
                    </div>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="text-white hover:text-yellow-300 transition-colors"
                    >
                      <FaRedo className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    value={userCaptchaInput}
                    onChange={(e) => {
                      setUserCaptchaInput(e.target.value);
                      setIsValidCaptcha(e.target.value === captchaValue);
                    }}
                    placeholder="Enter captcha text"
                    className="w-full px-4 py-3 bg-white/20 border border-indigo-300/50 
                               rounded-md text-white placeholder-indigo-200 
                               focus:outline-none focus:ring-2 focus:ring-yellow-300 
                               focus:border-yellow-300 transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isValidCaptcha}
                >
                  Send Message
                </button>

                <AnimatePresence>
                  {formStatus === 'success' && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 text-green-300 font-medium text-center bg-green-500/20 p-3 rounded-md"
                    >
                      Message sent successfully! I&apos;ll get back to you soon.
                    </motion.p>
                  )}
                  {formStatus === 'error' && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 text-red-300 font-medium text-center bg-red-500/20 p-3 rounded-md"
                    >
                      Oops! Something went wrong. Please try again or contact me directly.
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>

              <div className="mt-12 text-center">
                <p className="text-indigo-100 mb-4">Or connect with me on social media:</p>
                <div className="flex justify-center space-x-6 text-3xl text-yellow-300">
                  <SocialLink href="https://github.com/GitVerseRALF?tab=repositories" icon={<FaGithub />} label="GitHub" hoverColor="hover:text-white" />
                  <SocialLink href="https://www.linkedin.com/in/rafata-alfatih-a1707a28b" icon={<FaLinkedin />} label="LinkedIn" hoverColor="hover:text-white" />
                  <SocialLink href="https://www.instagram.com/rafataalfatih/?next=%2F" icon={<FaInstagram />} label="Instagram" hoverColor="hover:text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-400 py-8 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p>&copy; {new Date().getFullYear()} Rafata Alfatih. All rights reserved.</p>
            <p className="text-sm mt-1">Built with <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Next.js</a> and <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Tailwind CSS</a>.</p>
          </div>
        </footer>

      </div>
    </>
  );
};

// Helper components (can be moved to separate files)
const InfoCard = ({ title, content }: { title: string; content: string }) => (
  <motion.div 
    className="bg-indigo-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
    whileHover={{ y: -5 }}
  >
    <h4 className="font-semibold text-gray-900 mb-2 text-lg">{title}</h4>
    <p className="text-gray-700 leading-relaxed">{content}</p>
  </motion.div>
);

const SocialLink = ({ href, icon, label, hoverColor = 'hover:text-indigo-500' }: { href: string; icon: JSX.Element; label: string; hoverColor?: string }) => (
  <motion.a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    aria-label={label}
    className={`transition-colors duration-300 ${hoverColor}`}
    whileHover={{ scale: 1.2, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
  >
    {icon}
  </motion.a>
);

export default Portfolio;