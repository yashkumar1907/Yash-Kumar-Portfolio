const portfolioKnowledge = {
  profile: {
    name: 'Yash Kumar',
    role: 'Software Developer / Full Stack Developer / AI-ML Enthusiast',
    interests: ['Full Stack Development', 'AI / ML', 'Problem Solving'],
    availability: 'Available for opportunities',
    contactEmail: 'yashkumar9926@gmail.com',
  },
  education: {
    degree: 'B.Tech in Computer Science and Engineering with AI',
    institution: 'Netaji Subhas University of Technology',
    expectedGraduation: 2027,
  },
  skills: {
    programming: ['Python', 'C', 'C++', 'JavaScript'],
    webAndBackend: ['HTML', 'CSS', 'Node.js', 'Express.js', 'REST APIs', 'JWT', 'Mongoose'],
    database: ['SQL', 'MongoDB'],
    coreComputerScience: ['DSA', 'DBMS', 'Operating Systems', 'OOP', 'System Design'],
    tools: ['Git', 'GitHub', 'Postman', 'Render'],
  },
  internship: {
    role: 'Software Development Intern',
    company: 'Jindal Stainless Ltd.',
    location: 'Hisar',
    duration: 'May 2026 – July 2026',
    work: [
      'Developed a full-stack enterprise application using Node.js, Express.js, MongoDB, and Mongoose.',
      'Built a modular frontend and REST APIs.',
      'Implemented authentication and authorization, CRUD operations, Mongoose schemas/models and validation.',
      'Integrated Excel import/export and PDF management.',
      'Implemented filtering, PO expiry monitoring, and audit tracking.',
      'Used Postman for API testing, Git/GitHub, MongoDB Atlas, and Render for deployment.',
    ],
  },
  projects: [
    {
      name: 'AI Email Copilot',
      technologies: ['Node.js', 'Express.js', 'MongoDB', 'Gmail API', 'Gemini API'],
      description: 'An AI-powered email assistant that connects with Gmail and provides AI-assisted workflows for working with email.',
      details: [
        'Modular backend routes/controllers/services.',
        'Authentication with Google OAuth 2.0 using Passport and session authentication.',
        'Gmail read/send scopes; persistent access and refresh tokens in MongoDB; token refresh and secure cookies.',
        'Gemini-powered email summarization, reply drafting, action-item extraction, translation, tone improvement, and email composition.',
        'Reusable prompts, input validation, and API error handling.',
      ],
    },
    {
      name: 'Hospital Management System',
      technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose'],
      description: 'A full-stack hospital management system for managing patients, doctors, appointments, and time slots.',
      details: [
        'Patient, doctor, admin, appointment, and slot management.',
        'JWT authentication, role-based access control, bcryptjs password hashing, protected routes, and validation.',
        'Multer and Cloudinary; MongoDB ObjectId references and indexed queries.',
        'Automated 30-minute slot generation, availability and slot blocking, and a unique compound index preventing duplicate slots.',
      ],
    },
  ],
  achievements: [],
};

module.exports = portfolioKnowledge;
