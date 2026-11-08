export const phdContent = {
  intro: [
    'My interests span foundation models for language, vision, and multimodal tasks. What I enjoy most is research that connects this technical work with the study of humans, whether through modeling human behavior, examining our interactions with AI, or drawing on psychological theory and evidence. The directions below reflect that interest, and I’d like to spend my PhD pursuing a focused question within one of them.'
  ],
  themes: [
    {
      id: 'modeling-and-simulation',
      title: 'Modeling and Simulation',
      shortTitle: 'Modeling & simulation',
      overview: 'I’m interested in using foundation models to study individual behavior and social systems. What matters to me is connecting simulations to evidence about real people.',
      subjects: [
        {
          title: 'Human Behavior and Personalization',
          description: 'Models built from interaction histories can capture a person’s preferences, goals, and changing behavior. The challenge is to make these representations useful for recommendations and personalization while testing them against new observations.'
        },
        {
          title: 'Simulation-Based Evaluation',
          description: 'Interactive environments offer a way to test systems when real-world experiments are difficult, costly, or sensitive, from urban planning to clinical conversations. Their usefulness depends on understanding what they reproduce accurately and where they diverge from reality.'
        },
        {
          title: 'Population and Social Simulation',
          description: 'Populations of model-driven agents can provide environments for studying coordination, information diffusion, and responses to interventions. The work involves representing differences between individuals and checking collective patterns against observed behavior.'
        }
      ]
    },
    {
      id: 'efficient-models',
      title: 'Efficient Language and Vision–Language Models',
      shortTitle: 'Efficient models',
      overview: 'I’m interested in models that can work well on local and edge devices. That means taking privacy and the limits of everyday hardware seriously, alongside model quality.',
      subjects: [
        {
          title: 'Privacy-Aware On-Device Assistants',
          description: 'Personal assistants can keep sensitive context and memory locally while seeking help from larger server models. This brings questions about what to share, how to coordinate the models, and how to measure privacy alongside usefulness.'
        },
        {
          title: 'Task-Specific and Hardware-Aware Models',
          description: 'Distillation, adaptation, and compression can make smaller models useful for particular language and visual tasks. Evaluating them on actual devices brings task quality into the same picture as memory, latency, and energy use.'
        }
      ]
    },
    {
      id: 'learning-agents',
      title: 'Learning, Memory, and Adaptation in Agents',
      shortTitle: 'Learning agents',
      overview: 'I enjoy building agents and understanding what helps them work reliably beyond a single interaction. Coding agents and general-purpose assistants are both settings I’d like to explore.',
      subjects: [
        {
          title: 'Feedback-Driven Self-Improvement',
          description: 'Execution results, tool feedback, and past attempts give agents evidence for improving their behavior. The important questions are which feedback helps and whether an improvement carries over to tasks the agent has not already tried.'
        },
        {
          title: 'Long-Term Agent Memory',
          description: 'Useful memory involves choosing what to keep, retrieving it at the right time, and revising it when circumstances change. This supports work across sessions while making room for conflicting, incomplete, or outdated information.'
        },
        {
          title: 'Adaptation to New Tasks',
          description: 'Agents can reuse tools and learned procedures when they encounter unfamiliar tasks or environments. The challenge is to acquire and combine skills with less repeated trial and error while retaining what already works.'
        }
      ]
    },
    {
      id: 'clinical-ai',
      title: 'Clinical AI and Mental Health',
      shortTitle: 'Clinical AI',
      overview: 'My master’s research grew out of questions about psychology and mental health. I’d like to keep exploring how foundation models can support clinicians and patients, with careful attention to what works in practice.',
      subjects: [
        {
          title: 'Privacy-Aware Clinical Models',
          description: 'Clinical models need ways to learn from sensitive data while limiting disclosure and memorization risks. Privacy-preserving training and synthetic data offer research directions, with both privacy and clinical usefulness requiring careful evaluation.'
        },
        {
          title: 'Generative AI for Clinicians',
          description: 'Tools can help clinicians gather information, organize evidence, and prepare documentation or diagnostic hypotheses for review. Their value depends on how they affect reasoning, workload, and errors within the actual clinical workflow.'
        },
        {
          title: 'AI for Therapeutic Support',
          description: 'Conversational systems may support psychological interventions and help people between care sessions. This calls for studying therapeutic communication and patient outcomes, alongside clear boundaries and ways to involve a human professional when needed.'
        },
        {
          title: 'Clinical Foundation Models',
          description: 'Models trained or adapted on clinical language, patient histories, and relevant multimodal data could support several clinical tasks. Key questions concern how they represent context, communicate uncertainty, and generalize across patients and care settings.'
        }
      ]
    },
    {
      id: 'human-ai-interaction',
      title: 'Human–AI Interaction',
      shortTitle: 'Human–AI interaction',
      overview: 'I’m interested in what happens when people use AI in everyday thinking and work. The interaction itself matters: how people collaborate with a system, question it, and stay in control.',
      subjects: [
        {
          title: 'Human–Agent Collaboration and Control',
          description: 'Working with an agent involves communicating goals, delegating tasks, and deciding how much initiative it should take. Good interfaces help people inspect plans, correct misunderstandings, and intervene as their needs change.'
        },
        {
          title: 'Appropriate Reliance and Decision Support',
          description: 'People need ways to judge when AI assistance is useful and when to examine it more closely. Explanations, uncertainty communication, and interaction design can be studied through their effects on decisions and reliance.'
        },
        {
          title: 'Learning and Skill Development',
          description: 'AI assistance can change both how people complete a task and what they learn from doing it. Evaluating the timing and form of help should include what people can do independently after that help is withdrawn.'
        }
      ]
    },
    {
      id: 'human-diversity',
      title: 'Human Diversity in Foundation Models',
      shortTitle: 'Human diversity',
      overview: 'People bring different languages, cultures, and experiences to AI systems. I’m interested in understanding how models respond to those differences and improving how they serve communities that receive less attention.',
      subjects: [
        {
          title: 'Cultural Knowledge and Context',
          description: 'Cultural knowledge, norms, and perspectives shape what makes a response appropriate in a particular setting. Evaluation and adaptation need to account for differences within communities as well as between them.'
        },
        {
          title: 'Bias, Fairness, and Representation',
          description: 'Models can reproduce stereotypes and treat social groups differently through both their answers and their performance. Studying these effects means connecting measurements to specific tasks, practical consequences, and the experiences of affected people.'
        },
        {
          title: 'Multilingual and Inclusive Models',
          description: 'Many languages, dialects, and communities have limited representation in model training and evaluation. Better resources and methods should reflect how people actually use language, including local context and the needs of its speakers.'
        }
      ]
    }
  ],
  motivation: {
    title: 'Why I want to pursue a PhD',
    paragraphs: [
      'I love research! I like having time to stay with a question: form a hypothesis, build something to test it, look carefully at what happens, and let that lead to the next question. I enjoy complex problems that take time to understand, and I enjoy sharing the work and talking it through with others.',
      'I’ve been lucky to experience both research and engineering in industry. I’ve enjoyed the engineering work and done well in it, but research is the work I feel most drawn to. A PhD feels like a path I want to take for the work and the experience themselves, as well as for where it might lead.',
      'At the moment, I see myself continuing in academia or an industry research role. That makes doing a PhD well important to me: developing sound judgment, doing careful work, and making contributions I can stand behind.'
    ]
  },
  readiness: {
    title: 'Why I think I’d make a good PhD researcher',
    paragraphs: [
      'During my master’s at the University of Tehran, I built a strong base in deep learning and foundation models, finished with a GPA of 19.14/20, and carried out my first research projects. That work includes a paper in Findings of EACL 2026 and another currently under review at NAACL.',
      'I also learned that I can take ownership of a research project. With PsyCIDRA, I developed the idea and framework, led the work, coordinated the team, and wrote the paper. I feel ready to build on that experience and take responsibility for a question from its early stages through experiments and writing.',
      'Since my bachelor’s, I’ve put effort into developing my critical thinking: examining assumptions, asking why, and being willing to change my mind. I enjoy working with others and have often received encouraging feedback on how I collaborate. Presenting ideas and talking through difficult questions are parts of the work I’m comfortable with and enjoy.',
      'My experience as a Senior AI Engineer also helps me turn ideas into working systems quickly and with care. I’d be happy to contribute through teaching or student mentorship, too; I’ve worked as a teaching assistant, led workshops, and helped newer master’s students shape their research projects.',
      'Last but not least, I have a genuine passion for research. People who have been through a PhD have often told me how much that matters, and I believe it would help keep me going through the difficult parts.'
    ]
  }
};
