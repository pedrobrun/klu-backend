# OpenAI Chat Completion Mimic API

This project implements an API that mimics the OpenAI Chat Completion endpoint. The dataset used in this project can be found [here](https://huggingface.co/datasets/anon8231489123/ShareGPT_Vicuna_unfiltered/blob/main/ShareGPT_V3_unfiltered_cleaned_split.json).

The project includes three versions, each building upon the last to optimize performance and enhance functionality. Each version returns an object with a `choices` field that contains multiple possible next messages based on the data available.

## Version 1 - Starting Point (Simplest but less performant)

🧠 In the initial version, the data is stored in a way that mirrors the structure of the original JSON file. For each request to the endpoint, an array of messages is processed. The system focuses on the last message, while disregarding the rest. It finds all the messages that are equal to the last message that the user sent, querying for the messages inside the `conversations` array, then it returns all the possible next messages, in case they exist. <br/> 🌱 The average seeding time for this version averaged impressively only 22 seconds.
<br/>
📄 Data structure:

```json
{
  "_id": "some-object-id-here",
  "externalId": "id-that-came-from-the-json-file",
  "conversations": [
    {
      "from": "human",
      "value": "Some dummy message"
    },
    {
      "from": "gpt",
      "value": "Some dummy response"
    }
  ]
}
```

## Version 2 - Enhanced Version (Best performance)

🧠 Building on the initial approach, this version restructures the data by breaking it down into individual messages, which resulted in far more database documents. Now, in our seeding process, we create one document in the database for each message, containing its content along with the content of next message. To enhance the speed of the queries, indexes are added to the `from` and `value` fields associated with the last message sent by the user. For each request to the endpoint, an array of messages is processed. The system focuses on the last message, while disregarding the rest. It queries for the indexed fields that were mentioned, which improved the performance tremendously. After querying, it returns all the possible next messages, in case they exist. <br/>
🌱 Seeding time for this version averaged 50 seconds. <br/>
📄 Data structure:

```json
{
  "_id": "some-object-id-here",
  "externalId": "id-that-came-from-the-json-file",
  "from": "human", // indexed
  "value": "dummy value of this message", // indexed
  "nextMessageValue": "dummy content of the next message",
  "nextMessageType": "gpt"
}
```

## Version 3 - Another Enhanced Version (Also showed a good performance)

🧠 I built this version because I felt the need of enhancing the "integrity" of the data a little bit, querying also for the previous message. This way we can avoid receiving Megabytes of data in response when querying for simple messages that have a content such as "continue".
So, for this version, the data structure is further expanded to include references to both the next message and the preceding one for each individual message. Along with maintaining the indexes on `from` and `value` fields, new indexes on the new fields `prevMessageFrom` and `prevMessageValue` are introduced. As I said, also querying for the previous message helps managing common messages more efficiently by significantly reducing the number of potential messages returned. <br/> 🌱 The average seeding time for this version is approximately 1 minute and 40 seconds. <br/> 📄 Data structure:

```json
{
  "_id": "some-object-id-here",
  "externalId": "id-that-came-from-the-json-file",
  "from": "gpt",
  "value": "dummy message value",
  "prevMessageValue": "dummy previous message value",
  "prevMessageType": "human",
  "nextMessageValue": "dummy next message value",
  "nextMessageType": "human"
}
```

# Tech Stack Decisions

## Language Tradeoff

I chose Node.js as the primary technology for this project over something else like Python due to the following reasons:

### Scalability

Node.js is non-blocking and asynchronous by nature, making it particularly well-suited for handling multiple concurrent requests and I/O operations. This characteristic is a crucial feature for a highly performant API.

It is built on Google Chrome's V8 JavaScript engine, which has powerful capabilities and can handle thousands of concurrent connections with a single server process. This feature makes Node.js highly scalable, aligning perfectly with our requirement to support hundreds of thousands of requests at scale. Additionally, Node.js provides features such as clustering and worker threads to further enhance the performance and scalability of the application.

### Real-Time Applications

Node.js is an excellent choice for real-time applications, particularly those involving chat functionality, due to its event-based architecture and non-blocking I/O. Given that our task involves creating an API to mimic a chat completion endpoint, the real-time capabilities of Node.js can be leveraged.

### High-Performance Seeding with Node.js Streams

One more crucial aspect to consider is data seeding. The dataset provided for this task is a significant 673MB JSON file. While Python is an excellent language for data handling and manipulation, Node.js also shines in this area with its powerful Streams API.

Node.js Streams provide an interface for working with streaming data in Node.js. They are objects that allow reading data from a source or writing data to a destination in a continuous manner. By handling data piece by piece, rather than loading the entire data into memory before processing, Streams substantially reduce the memory footprint, making them an excellent tool for working with large data sets.

For this task, I leveraged the Streams in Node.js to build a robust and high-performing seeding script. This approach was able to manage the large volume of data efficiently, providing a swift and performant seeding process without overloading the memory. This is another reason why Node.js was a great fit for this project.

## Database Choice: MongoDB

The choice of database technology was also important. MongoDB has the ability to handle vast amounts of unstructured data, offering high performance, scalability, and flexibility. This NoSQL database allows storing data in flexible, JSON-like documents, meaning fields can vary from document to document and the data structure can be changed over time. This characteristic perfectly matches the nature of our dataset.

MongoDB also offers advanced features such as indexing, which I leveraged to significantly enhance the querying performance. Indexing is especially important for our use case, where querying for specific messages is a central part of the assignment. The denormalized nature of the models further justifies the choice of a NoSQL database like MongoDB. By keeping related data together in a single document, denormalization can improve read performance, an essential aspect considering our requirement to rapidly return chat completions.

## Framework: NestJS

For the development of the backend application, NestJS was chosen. This framework builds upon the robustness and performance of Node.js and adds its layer of design principles, such as Dependency Injection and modularity, which brings in practices from other mature languages like Java or C#. The use of NestJS ensures the scalability of the application, maintaining the codebase maintainable and organized, even as the project grows. NestJS also integrates well with TypeScript, which enhances the developer experience as well as code quality in general.

## 📊 Benchmark

For benchmarking, I relied on Autocannon, a powerful HTTP/1.1 benchmarking tool, running on my Mac M1 14' (16GB RAM). The Autocannon was set up with default configurations and used to evaluate the performance of each version of the API. Each stat is an average derived from the benchmarking process:

🚀 **V1:**

- 🐌 Latency: 6139.06ms
- ⚡ Requests per second: 29
- 🔄 Requests per minute: 1740

![bench_klu_v1](https://github.com/pedrobrun/klu-backend/assets/82632528/c4713d97-ae33-4c16-a09d-d914b9c8de22)

<br/>

🚀 **V2:**

- 🐌 Latency: 106.53ms - ⭐️ <strong>98.3%</strong> performance improvement compared to V1
- ⚡ Requests per second: 4675.9 - ⭐️ <strong>16058%</strong> performance improvement compared to V1
- 🔄 Requests per minute: 280554 - ⭐️ <strong>15992%</strong> performance improvement compared to V1
  
![v2](https://github.com/pedrobrun/klu-backend/assets/82632528/3939996d-cc4b-4e24-8115-f9a094e2bb3a)

<br/>

🚀 **V3:**

- 🐌 Latency: 115.53ms - ⭐️ <strong>98.1%</strong> performance improvement compared to V1
- ⚡ Requests per second: 4291.5 - ⭐️ <strong>14732%</strong> performance improvement compared to V1
- 🔄 Requests per minute: 257490 - ⭐️ <strong>14719%</strong> performance improvement compared to V1

![v3](https://github.com/pedrobrun/klu-backend/assets/82632528/5c0df890-6e99-48c0-9160-a9d2627d981c)

## Installation

```bash
$ yarn install
```

## Dockerized Environment

```bash
$ yarn env:setup # start the mongodb container
$ yarn env:stop # stop the mongodb container
```

## Env variables

Set up your env variables looking into .env.example. Rename the file to just .env.

## Seeding

1. Name your json file containing the data as `conversations.json` and put it at `src/seed-data/conversations.json`. After that you can hit the `/conversation/seed` endpoint with a POST request sending this as the body:

```json
{
  "secret": "SUPERSECRETSEEDKEY"
}
```

This secret key should be your `SEED_SECRET` from your .env file.

## Completion Endpoint

1. Hit the `/conversation/completion` endpoint with a POST request, the body should look like this:

```json
{
  "messages": [
    {
      "from": "human",
      "value": "Summarize the main ideas of Brendon Burchard's Experts Academy into bullet points as it pertains to a growth marketing agency implementing these strategies and tactics for their clients..."
    }
  ]
}
```

You can also send an array of messages:

```json
{
  "messages": [
    {
      "from": "human",
      "value": "Some other message..."
    },
    {
      "from": "human",
      "value": "Summarize the main ideas of Brendon Burchard's Experts Academy into bullet points as it pertains to a growth marketing agency implementing these strategies and tactics for their clients..."
    }
  ]
}
```

Sample response:

```json
{
  "choices": [
    {
      "from": "gpt",
      "value": "some message content here"
    },
    {
      "from": "gpt",
      "value": "some other stuff here"
    }
  ]
}
```

## Benchmarking

To run your own benchmarking tests, just run in your terminal, at the root of the project:

```bash
$ yarn benchmark:completion
```

## Running the app

```bash
# watch mode
$ yarn run start:dev
```

## Test

```bash
$ yarn test
```
