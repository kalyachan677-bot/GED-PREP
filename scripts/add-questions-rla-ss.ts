// add-questions-rla-ss.ts — เพิ่มโจทย์ GED จริง วิชา RLA + Social Studies
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

interface Q { questionText: string; difficulty: "easy" | "medium" | "hard"; answers: { content: string; isCorrect: boolean; explanation?: string }[]; explanation: string; }

const DATA: Record<string, { code: string; lessons: Record<string, Q[]> }> = {
  RLA: { code: "rla", lessons: {
    "Finding the Main Idea": [
      { questionText: "Read: 'The Amazon rainforest produces about 20% of the world\\'s oxygen. It is home to millions of species. However, deforestation threatens this vital ecosystem.' What is the main idea?", difficulty: "easy",
        answers: [
          { content: "The Amazon is beautiful to visit", isCorrect: false },
          { content: "The Amazon is a vital ecosystem threatened by deforestation", isCorrect: true, explanation: "Combines importance with the threat." },
          { content: "Deforestation only affects animals", isCorrect: false },
          { content: "The Amazon produces 100% of oxygen", isCorrect: false },
        ], explanation: "The main idea combines the forest's vital importance with the threat: it is crucial but endangered." },
      { questionText: "Read: 'Despite the rain, Sarah walked to work. She enjoyed the cool breeze. Her shoes were soaked but she felt refreshed.' Main idea?", difficulty: "medium",
        answers: [
          { content: "Sarah's shoes got wet", isCorrect: false, explanation: "Detail, not main idea." },
          { content: "Sarah found enjoyment in her rainy walk", isCorrect: true, explanation: "Positive experience despite rain." },
          { content: "It always rains for Sarah", isCorrect: false },
          { content: "Walking is better than driving", isCorrect: false },
        ], explanation: "The passage contrasts rain with Sarah's positive feelings, showing she enjoyed the walk." },
      { questionText: "What does 'main idea' mean?", difficulty: "easy",
        answers: [
          { content: "The most interesting detail", isCorrect: false },
          { content: "The central point the author communicates", isCorrect: true, explanation: "The primary message or thesis." },
          { content: "The first sentence of each paragraph", isCorrect: false },
          { content: "A summary of each paragraph", isCorrect: false },
        ], explanation: "The main idea is the author's primary message — the most important point of the passage." },
      { questionText: "A supporting detail does NOT:", difficulty: "medium",
        answers: [
          { content: "Provide evidence for the main idea", isCorrect: false },
          { content: "Give an example of the main idea", isCorrect: false },
          { content: "Contradict the main idea", isCorrect: true, explanation: "Supporting details support, never contradict." },
          { content: "Add specific information", isCorrect: false },
        ], explanation: "Supporting details reinforce the main idea — they do not contradict it." },
    ]    ],
    "Making Inferences": [
      { questionText: "'Maria slammed the door and threw her keys on the table. She stared out the window without speaking.' What can you infer?", difficulty: "medium",
        answers: [
          { content: "Maria is happy", isCorrect: false, explanation: "Slamming doors suggests negative emotions." },
          { content: "Maria is likely angry or upset", isCorrect: true, explanation: "Classic signs of anger/frustration." },
          { content: "Maria won the lottery", isCorrect: false },
          { content: "Maria is cooking dinner", isCorrect: false },
        ], explanation: "Slamming doors, throwing things, and silence are behaviors associated with anger." },
      { questionText: "What is an inference?", difficulty: "easy",
        answers: [
          { content: "A fact directly stated in text", isCorrect: false },
          { content: "A reasonable conclusion based on evidence and prior knowledge", isCorrect: true },
          { content: "The author's biography", isCorrect: false },
          { content: "A passage summary", isCorrect: false },
        ], explanation: "An inference goes beyond what is stated, combining text evidence with background knowledge." },
      { questionText: "'The plant had yellow drooping leaves and bone-dry cracked soil.' Infer:", difficulty: "easy",
        answers: [
          { content: "Needs more sunlight", isCorrect: false },
          { content: "Has not been watered in a long time", isCorrect: true, explanation: "Dry soil + drooping leaves = underwatering." },
          { content: "Was just watered", isCorrect: false },
          { content: "Is healthy", isCorrect: false },
        ], explanation: "Dry cracked soil and drooping yellow leaves indicate the plant needs water." },
      { questionText: "'Mrs. Chen enters — students straighten up. Mr. Brown enters — students keep talking.' Infer about Mrs. Chen:", difficulty: "medium",
        answers: [
          { content: "She is new", isCorrect: false },
          { content: "She is likely strict and authoritative", isCorrect: true, explanation: "Immediate behavioral change suggests authority." },
          { content: "She teaches math", isCorrect: false },
          { content: "Students dislike her", isCorrect: false },
        ], explanation: "Students' immediate respectful behavior when Mrs. Chen enters suggests she maintains strict authority." },
    ]    ],
    "Author's Purpose": [
      { questionText: "'Call now! 50% off expires at midnight!' What is the purpose?", difficulty: "easy",
        answers: [
          { content: "To inform", isCorrect: false },
          { content: "To persuade", isCorrect: true, explanation: "Urgency words aim to convince reader to act." },
          { content: "To entertain", isCorrect: false },
          { content: "To describe", isCorrect: false },
        ], explanation: "Urgency language (call now, expires) aims to persuade the reader to buy." },
      { questionText: "Which is most likely written to INFORM?", difficulty: "easy",
        answers: [
          { content: "A fairy tale about a dragon", isCorrect: false },
          { content: "A textbook chapter about the water cycle", isCorrect: true, explanation: "Textbooks present factual information." },
          { content: "A campaign speech", isCorrect: false },
          { content: "A restaurant review", isCorrect: false },
        ], explanation: "Textbooks present facts and explanations to educate — written to inform." },
      { questionText: "'The little dog bounced through wildflowers, tail wagging like a blur. He tumbled, popped up with a goofy grin.' Purpose?", difficulty: "easy",
        answers: [
          { content: "To persuade", isCorrect: false },
          { content: "To entertain", isCorrect: true, explanation: "Playful, vivid imagery for enjoyment." },
          { content: "To inform", isCorrect: false },
          { content: "To argue", isCorrect: false },
        ], explanation: "The playful, vivid description is meant to entertain and delight the reader." },
      { questionText: "PIE acronym: what does E stand for?", difficulty: "easy",
        answers: [
          { content: "Educate", isCorrect: false },
          { content: "Entertain", isCorrect: true, explanation: "PIE = Persuade, Inform, Entertain." },
          { content: "Explain", isCorrect: false },
          { content: "Evaluate", isCorrect: false },
        ], explanation: "PIE = Persuade, Inform, Entertain — the three main purposes of writing." },
    ]    ],
    "Point of View": [
      { questionText: "Which is first-person point of view?", difficulty: "easy",
        answers: [
          { content: "She walked to the store.", isCorrect: false, explanation: "Third person (she)." },
          { content: "I walked to the store.", isCorrect: true, explanation: "Uses 'I' — narrator is a character." },
          { content: "You walked to the store.", isCorrect: false, explanation: "Second person (you)." },
          { content: "They walked to the store.", isCorrect: false, explanation: "Third person (they)." },
        ], explanation: "First person uses 'I' or 'we' — the narrator is a character in the story." },
      { questionText: "'As you enter the cave, you feel a cold breeze.' This is which POV?", difficulty: "easy",
        answers: [
          { content: "First person", isCorrect: false },
          { content: "Second person", isCorrect: true, explanation: "Uses 'you' — reader is the character." },
          { content: "Third person", isCorrect: false },
          { content: "Omniscient", isCorrect: false },
        ], explanation: "Second person uses 'you,' directly addressing the reader as the protagonist." },
      { questionText: "Third-person omniscient narrator:", difficulty: "medium",
        answers: [
          { content: "Knows only one character's thoughts", isCorrect: false, explanation: "That's limited." },
          { content: "Is a character using 'I'", isCorrect: false, explanation: "That's first person." },
          { content: "Knows ALL characters' thoughts and feelings", isCorrect: true, explanation: "'Omniscient' means all-knowing." },
          { content: "Addresses reader as 'you'", isCorrect: false },
        ], explanation: "Omniscient = all-knowing. The narrator has access to every character's mind." },
      { questionText: "Advantage of third-person limited POV?", difficulty: "medium",
        answers: [
          { content: "Knows ALL characters' thoughts", isCorrect: false },
          { content: "Knows one character's thoughts while maintaining distance", isCorrect: true },
          { content: "Narrator is a character", isCorrect: false },
          { content: "Reader addressed as 'you'", isCorrect: false },
        ], explanation: "Third-person limited follows one character closely — their thoughts, feelings — but uses 'he/she/they.'" },
    ]    ],
    "Complete Sentences vs. Fragments": [
      { questionText: "Which is a complete sentence?", difficulty: "easy",
        answers: [
          { content: "Because she was tired.", isCorrect: false, explanation: "Dependent clause — incomplete thought." },
          { content: "She went to bed early because she was tired.", isCorrect: true, explanation: "Has subject, verb, and complete thought." },
          { content: "Walking in the park.", isCorrect: false, explanation: "No subject-verb pair." },
          { content: "The big red car on the street.", isCorrect: false, explanation: "No verb." },
        ], explanation: "A complete sentence needs: subject, verb, and complete thought." },
      { questionText: "Which is a sentence fragment?", difficulty: "medium",
        answers: [
          { content: "The dog barked loudly.", isCorrect: false },
          { content: "Running through the field behind the house.", isCorrect: true, explanation: "Participial phrase — no subject or main verb." },
          { content: "She enjoys reading mystery novels.", isCorrect: false },
          { content: "The students finished homework before dinner.", isCorrect: false },
        ], explanation: "'Running through the field' has no subject and no main verb — it's a fragment." },
      { questionText: "How to fix 'Although it was raining'?", difficulty: "medium",
        answers: [
          { content: "Add a period", isCorrect: false },
          { content: "Add an independent clause: 'Although it was raining, we went for a walk.'", isCorrect: true },
          { content: "Remove 'Although'", isCorrect: false },
          { content: "Make it longer", isCorrect: false },
        ], explanation: "Fix a dependent clause by attaching an independent clause to complete the thought." },
      { questionText: "What makes a fragment incorrect?", difficulty: "easy",
        answers: [
          { content: "Too long", isCorrect: false },
          { content: "Lacks subject, verb, or complete thought", isCorrect: true },
          { content: "Too many commas", isCorrect: false },
          { content: "Starts with a capital", isCorrect: false },
        ], explanation: "A fragment is incomplete — missing a subject, verb, or complete thought." },
    ]    ],
    "Subject-Verb Agreement": [
      { questionText: "'The group of students _____ going on a field trip.' Correct verb?", difficulty: "easy",
        answers: [
          { content: "is", isCorrect: true, explanation: "'Group' is singular subject. 'Of students' is a prepositional phrase." },
          { content: "are", isCorrect: false, explanation: "'Students' is in a prepositional phrase, not the subject." },
          { content: "were", isCorrect: false }, { content: "be", isCorrect: false },
        ], explanation: "'Group' (singular) is the subject. Prepositional phrases don't affect agreement." },
      { questionText: "Which sentence is correct?", difficulty: "easy",
        answers: [
          { content: "The dogs runs in the park.", isCorrect: false },
          { content: "The dogs run in the park.", isCorrect: true, explanation: "Plural subject 'dogs' needs plural verb 'run.'" },
          { content: "The dog run in the park.", isCorrect: false },
          { content: "The dogs is running.", isCorrect: false },
        ], explanation: "Singular subject = singular verb. Plural subject = plural verb." },
      { questionText: "'Neither the teacher nor the students _____ ready.'", difficulty: "hard",
        answers: [
          { content: "is", isCorrect: false, explanation: "Verb agrees with nearest subject 'students' (plural)." },
          { content: "are", isCorrect: true, explanation: "'Neither...nor': verb agrees with closer subject." },
          { content: "was", isCorrect: false }, { content: "has been", isCorrect: false },
        ], explanation: "'Neither...nor': verb agrees with the subject nearest to it. 'Students' = plural → 'are.'" },
      { questionText: "'Every one of the students _____ passed.'", difficulty: "medium",
        answers: [
          { content: "have", isCorrect: false },
          { content: "has", isCorrect: true, explanation: "'Every one' is singular → 'has.'" },
          { content: "are", isCorrect: false }, { content: "were", isCorrect: false },
        ], explanation: "'Every one' is singular, so it takes singular verb 'has.'" },
    ]    ],
    "Comma Rules": [
      { questionText: "Which correctly uses a comma in a list?", difficulty: "easy",
        answers: [
          { content: "I need to buy apples, bananas and oranges.", isCorrect: true, explanation: "Commas separate list items." },
          { content: "I need to buy, apples bananas, and oranges.", isCorrect: false },
          { content: "I need to buy apples bananas, and oranges.", isCorrect: false },
          { content: "I, need to buy apples bananas and oranges.", isCorrect: false },
        ], explanation: "Use commas between items in a series of three or more." },
      { questionText: "Which correctly uses a comma after an introductory element?", difficulty: "medium",
        answers: [
          { content: "After the movie we went to dinner.", isCorrect: false },
          { content: "After the movie, we went to dinner.", isCorrect: true, explanation: "Comma follows introductory phrases." },
          { content: "We went after, the movie to dinner.", isCorrect: false },
          { content: "After, the movie, we went to dinner.", isCorrect: false },
        ], explanation: "Use a comma after introductory words, phrases, or clauses." },
      { questionText: "FANBOYS mnemonic for coordinating conjunctions. Which is NOT one?", difficulty: "medium",
        answers: [
          { content: "For", isCorrect: false }, { content: "Because", isCorrect: true, explanation: "'Because' is subordinating, not coordinating." },
          { content: "And", isCorrect: false }, { content: "So", isCorrect: false },
        ], explanation: "FANBOYS = For, And, Nor, But, Or, Yet, So. 'Because' is subordinating." },
      { questionText: "Two independent clauses joined by 'but' need:", difficulty: "medium",
        answers: [
          { content: "No comma", isCorrect: false },
          { content: "A comma before 'but'", isCorrect: true, explanation: "Use comma before FANBOYS joining independent clauses." },
          { content: "A comma after 'but'", isCorrect: false },
          { content: "Two commas", isCorrect: false },
        ], explanation: "When a coordinating conjunction joins two independent clauses, use a comma before it." },
    ]    ],
    "Apostrophes and Quotation Marks": [
      { questionText: "Which uses the apostrophe correctly?", difficulty: "easy",
        answers: [
          { content: "The dog's are playing.", isCorrect: false, explanation: "Plural needs no apostrophe: 'dogs.'" },
          { content: "The dogs are playing.", isCorrect: true, explanation: "Plural nouns do NOT use apostrophes." },
          { content: "The dogs's are playing.", isCorrect: false },
          { content: "The dog,s are playing.", isCorrect: false },
        ], explanation: "Plural nouns (dogs) never need apostrophes. Apostrophes show possession or contractions." },
      { questionText: "_____ going to the store later.' Choose correct form.", difficulty: "easy",
        answers: [
          { content: "Their", isCorrect: false, explanation: "Possessive pronoun." },
          { content: "There", isCorrect: false, explanation: "Refers to a place." },
          { content: "They're", isCorrect: true, explanation: "Contraction of 'They are.'" },
          { content: "Thier", isCorrect: false },
        ], explanation: "They're = They are. Their = possessive. There = place/existence." },
      { questionText: "Which shows correct quotation mark usage?", difficulty: "medium",
        answers: [
          { content: "She said, \"I'll be there at five.\"", isCorrect: true, explanation: "Period goes inside closing quote mark." },
          { content: "She said, \"I'll be there at five\".", isCorrect: false, explanation: "Period should be inside." },
          { content: "She said \"I'll be there at five.\"", isCorrect: false, explanation: "Need comma after 'said.'" },
          { content: "She said, 'I'll be there at five.'", isCorrect: false, explanation: "Should use double quotes in American English." },
        ], explanation: "In American English, periods and commas go INSIDE quotation marks." },
      { questionText: "Which shows correct possessive form?", difficulty: "easy",
        answers: [
          { content: "The teacher's desk is in the corner.", isCorrect: true, explanation: "Singular possessive: teacher + 's." },
          { content: "The teachers desk is in the corner.", isCorrect: false, explanation: "No apostrophe = plural, not possessive." },
          { content: "The teacher desk's is in the corner.", isCorrect: false },
          { content: "The teacher' desk is in the corner.", isCorrect: false },
        ], explanation: "Singular possessive: add apostrophe + s → teacher's desk." },
    ]    ],
  }},
  SS: { code: "ss", lessons: {
    "The Declaration of Independence": [
      { questionText: "When was the Declaration of Independence adopted?", difficulty: "easy",
        answers: [
          { content: "July 4, 1776", isCorrect: true },
          { content: "July 4, 1775", isCorrect: false }, { content: "January 1, 1776", isCorrect: false }, { content: "June 15, 1776", isCorrect: false },
        ], explanation: "Adopted July 4, 1776, by the Second Continental Congress." },
      { questionText: "Primary author of the Declaration?", difficulty: "easy",
        answers: [
          { content: "George Washington", isCorrect: false }, { content: "Thomas Jefferson", isCorrect: true, explanation: "Drafted at age 33." },
          { content: "Benjamin Franklin", isCorrect: false }, { content: "John Adams", isCorrect: false },
        ], explanation: "Thomas Jefferson, 33, was the principal author with edits by Adams and Franklin." },
      { questionText: "Which idea from the Declaration is associated with John Locke?", difficulty: "medium",
        answers: [
          { content: "Taxation without representation", isCorrect: false },
          { content: "Unalienable rights to Life, Liberty, and pursuit of Happiness", isCorrect: true, explanation: "Adapted from Locke's natural rights." },
          { content: "Right to bear arms", isCorrect: false }, { content: "Freedom of speech", isCorrect: false },
        ], explanation: "Jefferson adapted Locke's natural rights (life, liberty, property) into the Declaration." },
      { questionText: "The Declaration argues governments get power from:", difficulty: "medium",
        answers: [
          { content: "The King", isCorrect: false }, { content: "Consent of the governed", isCorrect: true },
          { content: "The military", isCorrect: false }, { content: "Religious authority", isCorrect: false },
        ], explanation: "Governments derive 'their just powers from the consent of the governed.'" },
    ]    ],
    "The U.S. Constitution": [
      { questionText: "How many branches of government?", difficulty: "easy",
        answers: [
          { content: "Two", isCorrect: false }, { content: "Three", isCorrect: true, explanation: "Legislative, Executive, Judicial." },
          { content: "Four", isCorrect: false }, { content: "Five", isCorrect: false },
        ], explanation: "Three branches: Legislative (Congress), Executive (President), Judicial (Courts)." },
      { questionText: "Purpose of checks and balances?", difficulty: "medium",
        answers: [
          { content: "Make government more efficient", isCorrect: false },
          { content: "Ensure no single branch becomes too powerful", isCorrect: true },
          { content: "Help citizens vote", isCorrect: false }, { content: "Increase president's power", isCorrect: false },
        ], explanation: "Each branch can limit the others, preventing any one from becoming dominant." },
      { questionText: "First ten amendments are called the:", difficulty: "easy",
        answers: [
          { content: "Declaration of Rights", isCorrect: false },
          { content: "Bill of Rights", isCorrect: true, explanation: "Ratified 1791, protecting individual freedoms." },
          { content: "Articles of Confederation", isCorrect: false }, { content: "Federalist Papers", isCorrect: false },
        ], explanation: "The Bill of Rights — first ten amendments protecting individual freedoms." },
      { questionText: "Which amendment protects freedom of speech and religion?", difficulty: "easy",
        answers: [
          { content: "Second", isCorrect: false }, { content: "First", isCorrect: true, explanation: "Religion, speech, press, assembly, petition." },
          { content: "Fifth", isCorrect: false }, { content: "Tenth", isCorrect: false },
        ], explanation: "First Amendment: religion, speech, press, assembly, petition." },
    ]    ],
    "The Civil Rights Movement Overview": [
      { questionText: "Widely considered the start of the modern Civil Rights Movement?", difficulty: "medium",
        answers: [
          { content: "March on Washington 1963", isCorrect: false },
          { content: "Rosa Parks' arrest in Montgomery 1955", isCorrect: true, explanation: "Sparked the Montgomery Bus Boycott." },
          { content: "Civil Rights Act 1964", isCorrect: false }, { content: "Brown v. Board 1954", isCorrect: false },
        ], explanation: "Rosa Parks' Dec 1, 1955 arrest sparked the Montgomery Bus Boycott." },
      { questionText: "What did the Civil Rights Act of 1964 accomplish?", difficulty: "medium",
        answers: [
          { content: "Ended segregation and banned employment discrimination", isCorrect: true, explanation: "Outlawed discrimination based on race, color, religion, sex." },
          { content: "Gave women the right to vote", isCorrect: false },
          { content: "Abolished slavery", isCorrect: false }, { content: "Ended Vietnam War", isCorrect: false },
        ], explanation: "The 1964 Act prohibited discrimination in employment and public accommodations." },
      { questionText: "'Separate but equal' — established by which case, overturned by which?", difficulty: "hard",
        answers: [
          { content: "Plessy v. Ferguson, overturned by Brown v. Board of Education", isCorrect: true },
          { content: "Dred Scott, overturned by 13th Amendment", isCorrect: false },
          { content: "Marbury v. Madison, overturned by McCulloch", isCorrect: false },
          { content: "Roe v. Wade, overturned by Casey", isCorrect: false },
        ], explanation: "Plessy (1896) created it; Brown (1954) ruled separate is inherently unequal." },
      { questionText: "Purpose of the 1963 March on Washington?", difficulty: "easy",
        answers: [
          { content: "Protest Vietnam War", isCorrect: false },
          { content: "Advocate for civil and economic rights", isCorrect: true, explanation: "MLK's 'I Have a Dream' speech." },
          { content: "Demand women's suffrage", isCorrect: false }, { content: "Celebrate July 4th", isCorrect: false },
        ], explanation: "The March advocated civil/economic rights where MLK delivered 'I Have a Dream.'" },
    ]    ],
    "Key Figures: MLK and Rosa Parks": [
      { questionText: "MLK is best known for advocating:", difficulty: "easy",
        answers: [
          { content: "Violent revolution", isCorrect: false },
          { content: "Nonviolent civil disobedience", isCorrect: true, explanation: "Inspired by Gandhi's methods." },
          { content: "Armed resistance", isCorrect: false }, { content: "Political assassination", isCorrect: false },
        ], explanation: "MLK championed nonviolent civil disobedience for civil rights." },
      { questionText: "What did Rosa Parks do on Dec 1, 1955?", difficulty: "easy",
        answers: [
          { content: "Led a march on Washington", isCorrect: false },
          { content: "Refused to give up her bus seat to a white passenger", isCorrect: true },
          { content: "Gave 'I Have a Dream' speech", isCorrect: false }, { content: "Became first Black congresswoman", isCorrect: false },
        ], explanation: "Parks refused to give up her bus seat, sparking the Montgomery Bus Boycott." },
      { questionText: "MLK's famous 1963 speech?", difficulty: "easy",
        answers: [
          { content: "'I Have a Dream'", isCorrect: true }, { content: "'Give me liberty or give me death'", isCorrect: false },
          { content: "'Four score and seven years ago'", isCorrect: false }, { content: "'Ask not what your country...'", isCorrect: false },
        ], explanation: "Delivered at the Lincoln Memorial during the March on Washington, Aug 28, 1963." },
      { questionText: "How long did the Montgomery Bus Boycott last?", difficulty: "medium",
        answers: [
          { content: "About 1 month", isCorrect: false }, { content: "About 381 days (over a year)", isCorrect: true },
          { content: "6 months", isCorrect: false }, { content: "2 weeks", isCorrect: false },
        ], explanation: "381 days, from Dec 1955 to Dec 1956, ending with a Supreme Court ruling." },
    ]    ],
    "Legislative Branch: Congress": [
      { questionText: "How many chambers in Congress?", difficulty: "easy",
        answers: [
          { content: "One", isCorrect: false }, { content: "Two (Senate and House)", isCorrect: true },
          { content: "Three", isCorrect: false }, { content: "Four", isCorrect: false },
        ], explanation: "Bicameral: Senate (100) and House of Representatives (435)." },
      { questionText: "How many senators per state?", difficulty: "easy",
        answers: [
          { content: "Based on population", isCorrect: false }, { content: "Two", isCorrect: true, explanation: "Equal representation." },
          { content: "One", isCorrect: false }, { content: "Four", isCorrect: false },
        ], explanation: "Great Compromise: every state gets exactly 2 senators for equal representation." },
      { questionText: "Minimum age for a U.S. Representative?", difficulty: "medium",
        answers: [
          { content: "25 years old", isCorrect: true }, { content: "30", isCorrect: false, explanation: "That's for senators." },
          { content: "35", isCorrect: false, explanation: "That's for president." }, { content: "18", isCorrect: false },
        ], explanation: "Representative: at least 25 years old, citizen 7 years, live in the state." },
      { questionText: "Which chamber confirms presidential appointments?", difficulty: "medium",
        answers: [
          { content: "House", isCorrect: false }, { content: "Senate", isCorrect: true, explanation: "'Advice and consent' power." },
          { content: "Supreme Court", isCorrect: false }, { content: "Both equally", isCorrect: false },
        ], explanation: "The Senate confirms judicial nominations, cabinet members, and ambassadors." },
    ]    ],
    "Executive and Judicial Branches": [
      { questionText: "Head of the Executive Branch?", difficulty: "easy",
        answers: [
          { content: "Chief Justice", isCorrect: false }, { content: "The President", isCorrect: true, explanation: "Leads the Executive Branch." },
          { content: "Speaker of the House", isCorrect: false }, { content: "Vice President", isCorrect: false },
        ], explanation: "The President heads the Executive Branch, enforcing laws and serving as Commander in Chief." },
      { questionText: "Primary role of the Judicial Branch?", difficulty: "easy",
        answers: [
          { content: "Create laws", isCorrect: false }, { content: "Enforce laws", isCorrect: false },
          { content: "Interpret laws and determine constitutionality", isCorrect: true }, { content: "Fund the government", isCorrect: false },
        ], explanation: "Judicial Branch interprets laws and can declare them unconstitutional." },
      { questionText: "How many Supreme Court justices?", difficulty: "easy",
        answers: [
          { content: "7", isCorrect: false }, { content: "9", isCorrect: true, explanation: "1 Chief + 8 Associate Justices." },
          { content: "12", isCorrect: false }, { content: "50", isCorrect: false },
        ], explanation: "9 justices: 1 Chief Justice and 8 Associate Justices." },
      { questionText: "Supreme Court justices serve for:", difficulty: "medium",
        answers: [
          { content: "4 years", isCorrect: false }, { content: "6 years", isCorrect: false },
          { content: "Life (during good behavior)", isCorrect: true }, { content: "10 years", isCorrect: false },
        ], explanation: "Justices serve for life, ensuring judicial independence." },
    ]    ],
    "How Elections Work": [
      { questionText: "How is the U.S. President elected?", difficulty: "medium",
        answers: [
          { content: "Direct popular vote", isCorrect: false }, { content: "Electoral College", isCorrect: true, explanation: "270 electoral votes needed." },
          { content: "By Congress", isCorrect: false }, { content: "By state governors", isCorrect: false },
        ], explanation: "The Electoral College system: 270 of 538 electoral votes needed to win." },
      { questionText: "How many electoral votes needed to win presidency?", difficulty: "medium",
        answers: [
          { content: "270", isCorrect: true }, { content: "300", isCorrect: false },
          { content: "218", isCorrect: false }, { content: "538", isCorrect: false, explanation: "538 is the total." },
        ], explanation: "270 of 538 = simple majority needed to win the presidency." },
      { questionText: "What is a primary election?", difficulty: "medium",
        answers: [
          { content: "Final election for president", isCorrect: false },
          { content: "Voters choose a party's nominee", isCorrect: true },
          { content: "Only for local offices", isCorrect: false }, { content: "Held every 4 years", isCorrect: false },
        ], explanation: "A primary lets party members select their nominee for the general election." },
      { questionText: "U.S. voting age?", difficulty: "easy",
        answers: [
          { content: "16", isCorrect: false }, { content: "18", isCorrect: true, explanation: "26th Amendment (1971)." },
          { content: "21", isCorrect: false }, { content: "25", isCorrect: false },
        ], explanation: "The 26th Amendment (1971) lowered the voting age from 21 to 18." },
    ]    ],
    "Political Parties and the Two-Party System": [
      { questionText: "Two major U.S. political parties?", difficulty: "easy",
        answers: [
          { content: "Republican and Democratic", isCorrect: true }, { content: "Liberal and Conservative", isCorrect: false },
          { content: "Federalist and Anti-Federalist", isCorrect: false }, { content: "Green and Libertarian", isCorrect: false },
        ], explanation: "Democratic and Republican parties have dominated since the 1850s." },
      { questionText: "What is a 'third party'?", difficulty: "medium",
        answers: [
          { content: "A party that always wins", isCorrect: false },
          { content: "A party other than the two major parties", isCorrect: true, explanation: "e.g., Green, Libertarian." },
          { content: "Third-place finisher", isCorrect: false }, { content: "Party with three leaders", isCorrect: false },
        ], explanation: "Third parties are any parties besides the two major ones, like Green or Libertarian." },
      { questionText: "General platform of the Republican Party?", difficulty: "medium",
        answers: [
          { content: "Larger government, more programs", isCorrect: false },
          { content: "Smaller government, lower taxes, free market", isCorrect: true },
          { content: "Government controls all industries", isCorrect: false }, { content: "No military spending", isCorrect: false },
        ], explanation: "Republicans favor limited government, lower taxes, free-market capitalism." },
      { questionText: "Why is it hard for third parties to win presidential elections?", difficulty: "hard",
        answers: [
          { content: "Not allowed on ballot", isCorrect: false },
          { content: "Winner-take-all Electoral College and lack of funding", isCorrect: true },
          { content: "Illegal in most states", isCorrect: false }, { content: "Voters limited to two parties", isCorrect: false },
        ], explanation: "Winner-take-all Electoral College + less funding/media = very difficult for third parties." },
    ]    ],
  }},
};

async function main() {
  for (const [_, subjectData] of Object.entries(DATA)) {
    const subject = await p.subject.findFirst({ where: { code: subjectData.code } });
    if (!subject) { console.log(`SKIP ${subjectData.code}`); continue; }
    for (const [lessonTitle, questions] of Object.entries(subjectData.lessons)) {
      const lesson = await p.lesson.findFirst({ where: { title: lessonTitle, topic: { module: { subjectId: subject.id } } } });
      if (!lesson) { console.log(`  SKIP: ${lessonTitle}`); continue; }
      const existing = await p.question.findMany({ where: { lessonId: lesson.id }, include: { answers: true }, orderBy: { createdAt: "asc" } });
      console.log(`  ${subjectData.code} | ${lessonTitle} | existing: ${existing.length} | new: ${questions.length}`);
      const updateCount = Math.min(existing.length, questions.length);
      for (let i = 0; i < updateCount; i++) {
        const q = questions[i], eq = existing[i];
        await p.question.update({ where: { id: eq.id }, data: { questionText: q.questionText, explanation: q.explanation, difficulty: q.difficulty } });
        for (let j = 0; j < eq.answers.length && j < q.answers.length; j++) {
          await p.answer.update({ where: { id: eq.answers[j].id }, data: { content: q.answers[j].content, isCorrect: q.answers[j].isCorrect, explanation: q.answers[j].explanation || null } });
        }
      }
      for (let i = updateCount; i < questions.length; i++) {
        const q = questions[i];
        await p.question.create({ data: { subjectId: subject.id, lessonId: lesson.id, questionType: "multiple_choice", difficulty: q.difficulty, questionText: q.questionText, explanation: q.explanation, points: 1, isActive: true, answers: { create: q.answers.map((a, idx) => ({ content: a.content, isCorrect: a.isCorrect, sortOrder: idx, explanation: a.explanation || null })) } } });
      }
    }
  }
  const total = await p.question.count({ where: { questionText: { not: null } } });
  console.log(`\nDone! Questions with text: ${total}/${await p.question.count()}`);
}
main().catch(console.error).finally(() => p.$disconnect());