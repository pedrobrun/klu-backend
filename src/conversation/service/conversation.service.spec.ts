import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { ConversationRepository } from '../infraestructure/conversation.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from '../infraestructure/conversation.schema';
import { ConfigModule } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

describe('ConversationService', () => {
  let service: ConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGODB_URI),
        MongooseModule.forFeature([
          { name: Conversation.name, schema: ConversationSchema },
        ]),
      ],
      providers: [ConversationService, ConversationRepository],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe('createCompletion()', () => {
    it('should return the next message when it exists', async () => {
      const messages = [
        {
          from: 'human',
          value:
            "Summarize the main ideas of Jeff Walker's Product Launch Formula into bullet points as it pertains to a growth marketing agency implementing these strategies and tactics for their clients...",
        },
        {
          from: 'gpt',
          value:
            "Here are the main ideas of Jeff Walker's Product Launch Formula that can be applied by a growth marketing agency for their clients:\n\n1. Identify the target audience and their needs: Understand the ideal customer for the product or service, and create a messaging that resonates with them.\n2. Pre-launch: Build anticipation and excitement for the launch by creating buzz, gathering testimonials and case studies, and using social media to create awareness.\n3. Launch: Use a well-crafted launch sequence to maximize sales and conversions. This can include offering bonuses, creating scarcity, and using a deadline to create urgency.\n4. Post-launch: Follow up with customers, gather feedback, and continue to provide value to keep them engaged and loyal.\n5. Create a product suite: Once the initial product is successful, expand the offering by creating additional products or services that address other needs of the same audience.\n6. Continual optimization: Continually monitor and optimize the launch process and product suite to improve results.\n7. Build a community: Use the launch process to build a community of customers who are passionate about the product and can help spread the word.\n8. Use automation: Use technology and automation to streamline the launch process and improve efficiency.",
        },
        {
          from: 'human',
          value:
            "Summarize the main ideas of Brendon Burchard's Experts Academy into bullet points as it pertains to a growth marketing agency implementing these strategies and tactics for their clients...",
        },
      ];

      const result = await service.createCompletion({ messages });
      expect(result).toStrictEqual({
        from: 'gpt',
        value:
          "Here are the main ideas of Brendon Burchard's Experts Academy that can be applied by a growth marketing agency for their clients:\n\n1. Identify your expertise: Define your area of expertise and create a unique value proposition that differentiates you from others.\n2. Create a content strategy: Develop a content strategy that showcases your expertise and provides value to your audience. This can include blog posts, videos, podcasts, and social media content.\n3. Build your audience: Use social media, advertising, and other channels to build your audience and increase your visibility.\n4. Develop your products: Create products and services that align with your expertise and meet the needs of your audience. These can include digital products, courses, coaching, and consulting services.\n5. Create a brand: Develop a strong brand that reflects your expertise and resonates with your audience.\n6. Build authority: Establish yourself as an authority in your industry by speaking at events, publishing a book, or appearing on podcasts or TV shows.\n7. Monetize your expertise: Develop a monetization strategy that leverages your expertise and products to generate revenue.\n8. Build a team: As your business grows, build a team of experts to help you scale your business and provide excellent service to your clients.\n9. Continual improvement: Continually improve your products, services, and marketing strategies to stay ahead of the competition and provide the best possible experience for your clients.\n10. Focus on impact: Ultimately, focus on making a positive impact in the lives of your clients and using your expertise to make a difference in the world.",
      });
    });

    it('should throw a not found error when the last message sent does not exist', async () => {
      const messages = [
        {
          from: 'human',
          value: 'Some message that does not exist',
        },
      ];

      try {
        await service.createCompletion({ messages });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toStrictEqual('No completion found for this message');
      }
    });

    it('should throw a not found error when the last message sent does not have a next message', async () => {
      const messages = [
        {
          from: 'gpt',
          value:
            'Tony Robbins describes six core human needs that drive our behaviors and motivations. These six needs are:\n\n1. Certainty: The need for safety, stability, and predictability. This includes the need for comfort, security, and control over our environment.\n2. Variety: The need for novelty, excitement, and change. This includes the need for adventure, stimulation, and new experiences.\n3. Significance: The need to feel important, special, and unique. This includes the need for recognition, achievement, and respect.\n4. Connection: The need for social connection and love. This includes the need for intimacy, belonging, and friendship.\n5. Growth: The need for personal growth and development. This includes the need for learning, self-improvement, and progress.\n6. Contribution: The need to make a positive impact in the world. This includes the need to give back, help others, and make a difference.\n\nAccording to Tony Robbins, these six needs are universal and apply to all individuals. Each person may prioritize these needs differently, and may fulfill them in different ways, but they are fundamental drivers of human behavior. By understanding these needs, individuals can gain insight into their own motivations and behaviors, and can use this knowledge to create a more fulfilling and meaningful life.',
        },
      ];

      try {
        await service.createCompletion({ messages });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toStrictEqual('No completion found for this message');
      }
    });
  });
});
