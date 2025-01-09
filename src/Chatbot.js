import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import dayjs from 'dayjs';
import axios from 'axios';

const GEMINI_API_KEY = "AIzaSyDdblvpMbQpvuuTZXpmLtF9dCzAYIAYc7U"; // Replace with your Gemini API Key

const predefinedInstruction = `
     You are a helpful assistant. 
    Answer questions based on the following context and make sure you modify the answer grammarly make it easier to understand and reply in very polite way with a friendly tone for example Yes, Sure! Here is the details of the answer or Yah! Sure, You can find the details of the answer. 
    Also, please provide in proper formatted and manage spaces of text if require next line then put \n. do not take from the context and respond only the text related to answer no additional text like "based on the provided text or while the text doesn't elaborate more etc." etc. this type of text, response only the text related to answer. 
    if the question is not related to the context, please respond with "I'm sorry, I don't have an answer to that question." but also give answer related to greetings and goodbyes. Following context:
`;

const context = `
     Relationship Stunting Context
      What is Relationship Stunting:
        Relationship stunting refers to a situation where the emotional, intellectual, or mutual growth of a relationship is hindered or stagnant due to various reasons such as lack of communication, unresolved conflicts, emotional immaturity, or external pressures.

      Common Signs of Relationship Stunting:
        1. Lack of Emotional Intimacy:
          Partners struggle to connect on a deeper emotional level, often feeling distant or misunderstood.
        2. Poor Communication:
          Conversations are surface-level, and important issues are avoided or dismissed.
        3. Resentment and Unresolved Conflicts:
          Past conflicts remain unresolved, creating a barrier to growth and trust.
        4. Fear of Commitment:
          One or both partners avoid discussing the future or making long-term plans.
        5. Dependency or Control:
          One partner excessively depends on or tries to control the other, hindering individual and relational growth.

      Causes of Relationship Stunting:
        1. Emotional Immaturity:
          Partners may lack the emotional skills needed to nurture and grow a healthy relationship.
        2. Fear of Vulnerability:
          Difficulty in being open and honest can limit connection and trust.
        3. External Stressors:
          Financial issues, work stress, or family interference can overshadow the relationship.
        4. Mismatched Goals:
          Partners may have different expectations or long-term goals that are not aligned.

      How to Prevent Relationship Stunting:
        1. Foster Open Communication:
          Regularly share thoughts, feelings, and experiences to build trust and understanding.
        2. Establish Healthy Boundaries:
          Respect each other's individuality while setting boundaries that promote mutual growth.
        3. Practice Empathy:
          Show understanding and compassion for each other's feelings and perspectives.
        4. Nurture Emotional Intimacy:
          Spend quality time together, engage in meaningful conversations, and express affection.
        5. Align Goals Early:
          Discuss and agree on long-term goals, values, and priorities in the relationship.

      How to Handle Relationship Stunting:
        1. Identify the Root Cause:
          Reflect on and discuss the factors causing stunting, such as unresolved issues or emotional barriers.
        2. Seek Counseling or Therapy:
          Professional guidance can provide tools to address challenges and rebuild the relationship.
        3. Reconnect Intentionally:
          Dedicate time to rekindling emotional intimacy through shared activities, hobbies, or travel.
        4. Address Past Conflicts:
          Resolve lingering conflicts by discussing them openly and finding common ground.
        5. Focus on Personal Growth:
          Encourage individual self-improvement to enhance the relationship as a whole.

      How to Educate About Relationship Stunting:
        1. Awareness Campaigns:
          Share articles, blogs, and social media posts about recognizing and addressing relationship stunting.
        2. Workshops and Seminars:
          Organize events on communication skills, emotional intelligence, and conflict resolution.
        3. Include Relationship Education in Schools:
          Teach young adults about building healthy relationships and emotional resilience.
        4. Publish Guides and Resources:
          Create accessible resources, such as e-books or videos, about the importance of mutual growth in relationships.
        5. Promote Counseling Services:
          Advocate for couples counseling as a proactive measure rather than a last resort.

      When to Seek Help:
        - If unresolved issues persist despite attempts to address them.
        - When one or both partners feel unhappy or unfulfilled for an extended period.
        - If there are signs of emotional or physical abuse.

      Helpful Resources:
        1. Books:
          - "The Seven Principles for Making Marriage Work" by John Gottman
          - "Hold Me Tight: Seven Conversations for a Lifetime of Love" by Dr. Sue Johnson
          - "Attached: The New Science of Adult Attachment and How It Can Help You Find—and Keep—Love" by Amir Levine and Rachel Heller
        2. Online Support:
          - Relationship forums and counseling services.
        3. Hotlines:
          - National Domestic Violence Hotline: +1-800-799-7233
        4. Websites:
          - "relationshipadvice.com"
          - "therapyfinder.com"

      "For any further details or assistance, feel free to reach out to professionals or explore the resources listed above."
`;


const askQuestionToGemini = async (question) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        system_instruction: {
          parts: {
            text: predefinedInstruction + context,
          },
        },
        contents: {
          parts: {
            text: question,
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response?.data?.candidates[0]?.content?.parts[0]?.text;
  } catch (error) {
    console.error('Error fetching response:', error);
    throw new Error('Unable to get a response from Gemini API.');
  }
};

const Chatbot = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      id: dayjs().unix().toString(),
      text: 'Hey! How can I help you today?',
      sender: 'bot',
      dateTime: Date.now().toString(),
    },
  ]);

  const handleSend = async () => {
    if (!question.trim()) {
      return Alert.alert('Please provide a question.');
    }

    const userMessage = {
      id: dayjs().unix().toString(),
      text: question,
      sender: 'user',
      dateTime: dayjs().unix().toString(),
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: 'loading', text: '...', sender: 'bot', dateTime: '' },
    ]);
    setQuestion('');

    try {
      const botResponse = await askQuestionToGemini(question);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === 'loading' ? { ...msg, text: botResponse, id: dayjs().unix().toString() } : msg
        )
      );
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: dayjs().unix().toString(), text: 'Error fetching response.', sender: 'bot', dateTime: '' },
      ]);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'bot' ? styles.botMessage : styles.userMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your question here..."
          value={question}
          onChangeText={setQuestion}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  chatList: {
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    maxWidth: '80%',
  },
  botMessage: {
    backgroundColor: '#e6f7ff',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#d9fdd3',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Chatbot;
