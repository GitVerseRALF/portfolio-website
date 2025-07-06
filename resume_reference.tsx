import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';

const Portfolio: React.FC = () => {
  const personalInfo = {
    name: 'John Doe',
    title: 'Software Engineer',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Passionate software engineer with 5+ years of experience in full-stack development, specializing in creating scalable web applications.'
  };

  const skills = [
    'TypeScript', 'React', 'Next.js', 'Node.js', 
    'GraphQL', 'Docker', 'Kubernetes', 'AWS'
  ];

  const experience = [
    {
      company: 'Tech Innovations Inc.',
      position: 'Senior Software Engineer',
      duration: 'Jan 2021 - Present',
      responsibilities: [
        'Led development of microservices architecture',
        'Implemented CI/CD pipelines',
        'Mentored junior developers'
      ]
    },
    {
      company: 'WebSolutions LLC',
      position: 'Software Engineer',
      duration: 'Jun 2018 - Dec 2020',
      responsibilities: [
        'Developed responsive web applications',
        'Optimized application performance',
        'Collaborated with cross-functional teams'
      ]
    }
  ];

  const education = [
    {
      institution: 'Stanford University',
      degree: 'Master of Science in Computer Science',
      graduation: '2018'
    },
    {
      institution: 'UC Berkeley',
      degree: 'Bachelor of Science in Computer Engineering',
      graduation: '2016'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">{personalInfo.name}</h1>
          <p className="text-xl text-gray-600">{personalInfo.title}</p>
          
          {/* Contact Info */}
          <div className="flex justify-center space-x-4 mt-4">
            <a href={`mailto:${personalInfo.email}`} className="text-blue-600 hover:text-blue-800">
              <FaEnvelope className="inline mr-2" /> {personalInfo.email}
            </a>
            <a href={`tel:${personalInfo.phone}`} className="text-blue-600 hover:text-blue-800">
              <FaPhone className="inline mr-2" /> {personalInfo.phone}
            </a>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2 mb-4">Professional Summary</h2>
          <p className="text-gray-600">{personalInfo.summary}</p>
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index} 
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2 mb-4">Professional Experience</h2>
          {experience.map((job, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">{job.position}</h3>
              <p className="text-gray-600">{job.company} | {job.duration}</p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                {job.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Education */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2 mb-4">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{edu.degree}</h3>
              <p className="text-gray-600">{edu.institution} | Graduated {edu.graduation}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Portfolio;