export const phdContent = {
  researchIntro: 'During my M.Sc. in IT Engineering at the University of Tehran, my coursework focused on machine learning and deep learning. I conducted my master’s thesis research jointly in the Natural Language Processing Lab and the Computational Cognitive Psychology Lab, both in the Faculty of Electrical and Computer Engineering. My research interests span AI, especially natural language processing (NLP) and computer vision, and interdisciplinary work with psychology, the human sciences, and human–computer interaction (HCI).',
  focus: {
    title: 'Where foundation models meet psychology and the human sciences',
    paragraphs: [
      'I want to use large language models (LLMs), vision–language models (VLMs), and other deep learning models to study how people think and behave, individually and in groups. I’m also interested in building AI systems around people’s needs and studying how those systems shape learning, decisions, and collaboration.',
      'In turn, I want to draw on theories and evidence from psychology and the human sciences to improve how we design, train, and evaluate these models.'
    ]
  },
  directionsIntro: 'Alongside this focus, I’m interested in how models adapt to individuals on personal devices and how agents learn from experience.',
  themes: [
    {
      id: 'modeling-and-simulation',
      title: 'Computational modeling and simulation of human behavior',
      shortTitle: 'Behavioral modeling & simulation',
      overview: 'I’m interested in how people make decisions over time and how their interactions give rise to group behavior. I want to use foundation models to study both scales, from predicting individual choices to testing agent-based simulations against data from real groups.',
      subjects: [
        {
          title: 'Longitudinal modeling of individual preferences',
          description: 'I’d like to infer how a person’s goals, preferences, and routines change from their choices and interactions. The test I care about is whether the model predicts what that person does later or in a new setting.'
        },
        {
          title: 'Empirical validation of behavioral simulations',
          description: 'I’m drawn to simulations for settings where experiments are difficult, such as psychiatric interviews or urban planning. I’d compare simulated and human interactions under comparable conditions to see whether simulations reproduce response distributions and effects observed in human studies.'
        },
        {
          title: 'Emergent coordination and information diffusion',
          description: 'I’d vary who interacts with whom and how individuals respond to the same information. Can the resulting simulations account for how real groups coordinate, how information spreads, and how those patterns change under interventions?'
        }
      ]
    },
    {
      id: 'human-ai-interaction',
      title: 'Human–AI interaction',
      shortTitle: 'Human–AI interaction',
      overview: 'I want to design and evaluate interfaces for human–agent collaboration. The questions I keep coming back to are when people delegate, how they catch mistakes, and what they learn in the process.',
      subjects: [
        {
          title: 'Mixed-initiative interaction and human oversight',
          description: 'I’d compare interfaces that vary when an agent can act on its own and when a user can inspect, revise, or stop its plan. I want to know which controls help people catch and recover from errors, and how much effort that oversight takes.'
        },
        {
          title: 'Calibrating reliance in AI-assisted decisions',
          description: 'I’d record people’s judgments before and after they see an AI recommendation, varying the evidence and uncertainty cues shown with it. When do people revise a mistaken judgment in light of good advice, and when do they stick with a sound judgment despite bad advice?'
        },
        {
          title: 'Instructional scaffolding and skill transfer',
          description: 'I want to know how the timing and form of assistance affect what people learn. I’d compare support such as graduated hints and direct answers, then test whether people can apply what they learned to new tasks without the assistant.'
        }
      ]
    },
    {
      id: 'clinical-ai',
      title: 'Foundation models for digital mental health',
      shortTitle: 'Digital mental health',
      overview: 'My thesis on psychiatric interviewing got me thinking about the quality of the evidence a model elicits and how a clinician might use it. I want to pursue those questions in clinical assessment and decision support, and study where conversational tools can help between visits.',
      subjects: [
        {
          title: 'Privacy-preserving learning from clinical text',
          description: 'I’d compare differentially private fine-tuning and training on synthetic clinical notes. I want to measure clinical utility on held-out cases alongside how much patient-specific information the resulting models retain or expose.'
        },
        {
          title: 'Evidence elicitation and diagnostic reasoning',
          description: 'In my thesis, I separated the psychiatric interview from the diagnostic analysis of its transcript. I want to study which follow-up questions elicit useful evidence and how clinicians review a differential diagnosis when they can trace the supporting and conflicting evidence and see what was missed.'
        },
        {
          title: 'Evaluating conversational support between sessions',
          description: 'I’d like to study tools for brief check-ins and follow-up on goals agreed with a clinician. I want to measure whether they help people stay engaged with care and understand when a conversation should be handed back to a clinician.'
        },
        {
          title: 'Longitudinal clinical context and generalization',
          description: 'I’m interested in how models combine interview transcripts, clinical notes, and other relevant data to track changes over time. I’d test how their performance and uncertainty calibration hold up across patient populations and care settings.'
        }
      ]
    },
    {
      id: 'efficient-models',
      title: 'On-device personalization of foundation models',
      shortTitle: 'On-device personalization',
      overview: 'I want to build assistants that adapt to changing preferences and routines while keeping raw interaction histories on the user’s device. How much can the assistant learn locally, and when is it worth consulting a larger model?',
      subjects: [
        {
          title: 'Local user modeling and selective cloud delegation',
          description: 'I’d compare retrieval from local interaction histories with parameter-efficient adaptation. When a task benefits from a remote model, I want to find out how much context it actually needs and measure the trade-offs in personalization quality, information disclosure, and response time.'
        }
      ]
    },
    {
      id: 'learning-agents',
      title: 'Self-improving agents and long-term memory',
      shortTitle: 'Self-improving agents',
      overview: 'I’m interested in how coding agents and assistants learn from their own work. I want to know which lessons from tool use and task outcomes should persist across sessions, and whether those lessons help on unfamiliar tasks.',
      subjects: [
        {
          title: 'Learning from execution feedback',
          description: 'I’d compare pass/fail signals with richer feedback such as test failures and tool outputs. With the same number of attempts, which signals help an agent recover from a mistake and avoid repeating it on later tasks?'
        },
        {
          title: 'Memory retrieval, revision, and forgetting',
          description: 'I want to study what an agent should store, retrieve, revise, or discard as its context changes. A good test is whether it can use an earlier interaction and recognize when a fact or preference from that interaction is out of date.'
        },
        {
          title: 'Acquisition and transfer of procedural skills',
          description: 'Can an agent turn a successful sequence of actions into a reusable procedure and combine it with skills it already has? I’d test whether that reduces retries on held-out tasks and whether earlier skills still work after further updates.'
        }
      ]
    },
    {
      id: 'human-diversity',
      title: 'Multilingual and cross-cultural model evaluation',
      shortTitle: 'Multilingual & cultural evaluation',
      overview: 'I want to understand where language and vision–language models struggle with local context. A model can produce fluent text while misreading a social convention, making a stereotyped assumption, or misunderstanding a dialect that rarely appears in benchmarks.',
      subjects: [
        {
          title: 'Cultural grounding in text and images',
          description: 'I’d test how models use local practices, norms, and visual cues to interpret a situation. I want evaluations to reflect variation within communities, including cases where people familiar with the same context disagree about the best answer.'
        },
        {
          title: 'Counterfactual audits of stereotypes and disparities',
          description: 'I’d compare matched prompts that vary a social cue, such as a name or dialect, while holding the task and intended meaning fixed. I’m interested in whether that changes the quality of assistance or the recommendations people receive.'
        },
        {
          title: 'Benchmark design for underrepresented languages and dialects',
          description: 'I want to build benchmarks with speakers around tasks that reflect everyday language use. Locally authored examples and matched examples across varieties could help distinguish failures of language comprehension from gaps in cultural knowledge.'
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
      'I also learned that I can take ownership of a research project. In my study on psychiatric assessment, I developed the idea and framework, led the work, coordinated the team, and wrote the paper. I feel ready to build on that experience and take responsibility for a question from its early stages through experiments and writing.',
      'Since my bachelor’s, I’ve put effort into developing my critical thinking: examining assumptions, asking why, and being willing to change my mind. I enjoy working with others and have often received encouraging feedback on how I collaborate. Presenting ideas and talking through difficult questions are parts of the work I’m comfortable with and enjoy.',
      'My experience as a Senior AI Engineer also helps me turn ideas into working systems quickly and with care. I’d be happy to contribute through teaching or student mentorship, too; I’ve worked as a teaching assistant, led workshops, and helped newer master’s students shape their research projects.',
      'Last but not least, I have a genuine passion for research. People who have been through a PhD have often told me how much that matters, and I believe it would help keep me going through the difficult parts.'
    ]
  }
};
