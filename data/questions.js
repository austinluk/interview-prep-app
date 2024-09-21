let questions = [
  {
    content: `// Alan is designing a spaceship dashboard where the flight
// coordinates are updated continuously. He needs to know if a
// specific number exists in the flight coordinates array.

// Write a function
// \`searchCoordinates(coordinates: number[], target: number):
// boolean\` that returns true if the target exists in the array,
// otherwise false.

// Example 1:
// Input: coordinates = [1, 3, 5, 7, 9], target = 5
// Output: true

// Example 2:
// Input: coordinates = [2, 4, 6, 8, 10], target = 11
// Output: false`,
    testcase: [
      { coordinates: [1, 3, 5, 7, 9], target: 5 },
      { coordinates: [2, 4, 6, 8, 10], target: 11 },
      { coordinates: [], target: 5 },
      { coordinates: [5], target: 5 },
      { coordinates: [3, 3, 3, 3], target: 3 },
      { coordinates: [9007199254740991], target: 9007199254740991 },
    ],
    solution: [true, false, false, true, true, true],
    input_type: { coordinates: "number[]", target: "number" },
    output_type: "boolean",
    function_name: "searchCoordinates",
  },
  {
    content: `// Alvin is writing a system to track all the devices he's
// lost. He needs a function that returns the index of the first
// occurrence of the target gadget in a list, or -1 if it's not
// found.

// Write a function
// \`findGadgetIndex(gadgets: string[], target: string): number\`
// that returns the index of the target.

// Example 1:
// Input: gadgets = ['Phone', 'Tablet', 'Laptop'], target = 'Tablet'
// Output: 1

// Example 2:
// Input: gadgets = ['Headphones', 'Phone', 'Smartwatch'], target = 'Laptop'
// Output: -1`,
    testcase: [
      { gadgets: ["Phone", "Tablet", "Laptop"], target: "Tablet" },
      { gadgets: ["Headphones", "Phone", "Smartwatch"], target: "Laptop" },
      { gadgets: [], target: "Laptop" },
      { gadgets: ["Phone"], target: "Phone" },
      { gadgets: ["Phone", "Phone", "Phone"], target: "Phone" },
      { gadgets: ["Tablet"], target: "Laptop" },
    ],
    solution: [1, -1, -1, 0, 0, -1],
    input_type: { gadgets: "string[]", target: "string" },
    output_type: "number",
    function_name: "findGadgetIndex",
  },
  {
    content: `// Milad is overwhelmed with the number of DMs he's receiving.
// He needs a function that removes duplicate messages from an
// array.

// Write a function
// \`removeDuplicates(messages: string[]): string[]\` that returns
// the list without duplicates.

// Example 1:
// Input: messages = ['Hi', 'Hello', 'Hi', 'Hey']
// Output: ['Hi', 'Hello', 'Hey']

// Example 2:
// Input: messages = ['Good morning', 'Good morning', 'Good night']
// Output: ['Good morning', 'Good night']`,
    testcase: [
      { messages: ["Hi", "Hello", "Hi", "Hey"] },
      { messages: ["Good morning", "Good morning", "Good night"] },
      { messages: [] },
      { messages: ["Hi"] },
      { messages: ["Hello", "Hello", "Hello"] },
      { messages: ["Good night", "Good morning", "Good afternoon"] },
    ],
    solution: [
      ["Hi", "Hello", "Hey"],
      ["Good morning", "Good night"],
      [],
      ["Hi"],
      ["Hello"],
      ["Good night", "Good morning", "Good afternoon"],
    ],
    input_type: { messages: "string[]" },
    output_type: "string[]",
    function_name: "removeDuplicates",
  },
  {
    content: `// Austin is always causing chaos on the bus by sitting in the
// middle, making everyone around him leave. He needs a function
// to remove the elements next to him.

// Write a function
// \`removeNeighbors(seats: string[], index: number): string[]\`
// that removes the elements adjacent to Austin's seat.

// Example 1:
// Input: seats = ['Person', 'Austin', 'Person'], index = 1
// Output: ['Empty', 'Austin', 'Empty']

// Example 2:
// Input: seats = ['Person', 'Person', 'Austin', 'Person', 'Person'], index = 2
// Output: ['Person', 'Empty', 'Austin', 'Empty', 'Person']`,
    testcase: [
      { seats: ["Person", "Austin", "Person"], index: 1 },
      {
        seats: ["Person", "Person", "Austin", "Person", "Person"],
        index: 2,
      },
      { seats: [], index: 0 },
      { seats: ["Austin"], index: 0 },
      { seats: ["Person", "Austin"], index: 1 },
      { seats: ["Austin", "Person"], index: 0 },
    ],
    solution: [
      ["Empty", "Austin", "Empty"],
      ["Person", "Empty", "Austin", "Empty", "Person"],
      [],
      ["Austin"],
      ["Person", "Austin"],
      ["Austin", "Empty"],
    ],
    input_type: { seats: "string[]", index: "number" },
    output_type: "string[]",
    function_name: "removeNeighbors",
  },
  {
    content: `// Alan is building a storage system for the spaceship. He needs
// to sort all items based on their weight.

// Write a function
// \`sortItemsByWeight(items: number[]): number[]\` that sorts the
// array of item weights in ascending order.

// Example 1:
// Input: items = [10, 5, 8, 2, 4]
// Output: [2, 4, 5, 8, 10]

// Example 2:
// Input: items = [100, 50, 75, 20]
// Output: [20, 50, 75, 100]`,
    testcase: [
      { items: [10, 5, 8, 2, 4] },
      { items: [100, 50, 75, 20] },
      { items: [] },
      { items: [10] },
      { items: [5, 5, 5, 5] },
      { items: [9007199254740991, -9007199254740991] },
    ],
    solution: [
      [2, 4, 5, 8, 10],
      [20, 50, 75, 100],
      [],
      [10],
      [5, 5, 5, 5],
      [-9007199254740991, 9007199254740991],
    ],
    input_type: { items: "number[]" },
    output_type: "number[]",
    function_name: "sortItemsByWeight",
  },
  {
    content: `// Alvin loves collecting gadgets, but he often misplaces them.
// He needs a function that counts how many times each gadget
// appears in his collection.

// Write a function
// \`countGadgets(gadgets: string[]): Record<string, number>\`
// that returns a map of gadgets and their count.

// Example 1:
// Input: gadgets = ['Phone', 'Tablet', 'Phone', 'Laptop']
// Output: { Phone: 2, Tablet: 1, Laptop: 1 }

// Example 2:
// Input: gadgets = ['Watch', 'Phone', 'Phone', 'Watch']
// Output: { Watch: 2, Phone: 2 }`,
    testcase: [
      { gadgets: ["Phone", "Tablet", "Phone", "Laptop"] },
      { gadgets: ["Watch", "Phone", "Phone", "Watch"] },
      { gadgets: [] },
      { gadgets: ["Phone"] },
      { gadgets: ["Phone", "Phone", "Phone"] },
      { gadgets: ["Tablet", "Laptop"] },
    ],
    solution: [
      { Phone: 2, Tablet: 1, Laptop: 1 },
      { Watch: 2, Phone: 2 },
      {},
      { Phone: 1 },
      { Phone: 3 },
      { Tablet: 1, Laptop: 1 },
    ],
    input_type: { gadgets: "string[]" },
    output_type: "Record<string, number>",
    function_name: "countGadgets",
  },
  {
    content: `// Milad is so popular that people are constantly sending him
// questions. He needs a function to return only the DMs that end
// with a question mark.

// Write a function
// \`filterQuestions(messages: string[]): string[]\` that filters
// the array to return only questions.

// Example 1:
// Input: messages = ['How are you?', 'I’ll be there', 'What time is it?']
// Output: ['How are you?', 'What time is it?']

// Example 2:
// Input: messages = ['Are you coming?', 'Sure', 'Where are you?']
// Output: ['Are you coming?', 'Where are you?']`,
    testcase: [
      { messages: ["How are you?", "I’ll be there", "What time is it?"] },
      { messages: ["Are you coming?", "Sure", "Where are you?"] },
      { messages: [] },
      { messages: ["How are you?"] },
      { messages: ["Hi", "Hey", "Sure"] },
      { messages: ["Why?", "What?", "When?", "Who?"] },
    ],
    solution: [
      ["How are you?", "What time is it?"],
      ["Are you coming?", "Where are you?"],
      [],
      ["How are you?"],
      [],
      ["Why?", "What?", "When?", "Who?"],
    ],
    input_type: { messages: "string[]" },
    output_type: "string[]",
    function_name: "filterQuestions",
  },
  {
    content: `// Austin tends to disrupt people when sitting on a bus, so he
// needs to ensure the seats are empty around him.

// Write a function
// \`refillSeats(seats: string[], index: number): string[]\` that
// removes and refills the seats adjacent to Austin.

// Example 1:
// Input: seats = ['Empty', 'Austin', 'Empty'], index = 1
// Output: ['Person', 'Austin', 'Person']

// Example 2:
// Input: seats = ['Empty', 'Austin', 'Empty', 'Empty'], index = 1
// Output: ['Person', 'Austin', 'Person', 'Empty']`,
    testcase: [
      { seats: ["Empty", "Austin", "Empty"], index: 1 },
      { seats: ["Empty", "Austin", "Empty", "Empty"], index: 1 },
      { seats: [], index: 0 },
      { seats: ["Austin"], index: 0 },
      { seats: ["Person", "Austin"], index: 1 },
      { seats: ["Austin", "Person"], index: 0 },
    ],
    solution: [
      ["Person", "Austin", "Person"],
      ["Person", "Austin", "Person", "Empty"],
      [],
      ["Austin"],
      ["Person", "Austin"],
      ["Austin", "Empty"],
    ],
    input_type: { seats: "string[]", index: "number" },
    output_type: "string[]",
    function_name: "refillSeats",
  },
];

export default questions;
