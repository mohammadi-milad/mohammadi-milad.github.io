/** Shared chapter order and introductions for the static and interactive CV. */
export const cvSections = {
  education: {
    title: 'Education'
  },
  publications: {
    title: 'Publications',
    label: 'Publication'
  },
  awards: {
    title: 'Awards',
    label: 'Award'
  },
  research: {
    title: 'Research roles',
    label: 'Research role'
  },
  industry: {
    title: 'Industry',
    intro: 'Alongside my master’s, I worked part-time as an AI Engineer.'
  },
  teaching: {
    title: 'Teaching',
    intro: 'I volunteered as a teaching assistant to gain experience and pursue my passion for teaching.'
  },
  projects: {
    title: 'Projects',
    label: 'Project',
    intro: 'I have built collaborative prototypes in coursework and hackathons, applying language agents to data analysis and appointment booking. The entries below describe each project and my contribution.'
  },
  service: {
    title: 'Volunteering service',
    label: 'Volunteering',
    intro: 'Volunteering during high school and my bachelor’s shaped my soft skills, especially leadership.'
  }
};

/** Academic chapters and stages read newest first; dates stay on each record. */
export const cvChapters = [
  { id: 'masters', title: 'Master’s', period: '2023–2026', stages: [
    { id: 'year-three', title: 'Year three' },
    { id: 'year-two', title: 'Year two' },
    { id: 'year-one', title: 'Year one' }
  ] },
  { id: 'bachelors', title: 'Bachelor’s', period: '2018–2023' },
  { id: 'before-bachelors', title: 'Before the bachelor’s' }
];
