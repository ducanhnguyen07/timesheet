import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import axios from "axios";
import { Client, GatewayIntentBits } from "discord.js";
import { ProducerService } from "../../src/kafka/producer.service";

@Injectable()
export class DiscordService {
  private client: Client;

  private readonly DISCORD_WEBHOOK_URL = process.env.WEBHOOK_DISCORD_URL;
  private readonly USER_ID = process.env.DISCORD_USER_ID;

  constructor(
    private readonly producerService: ProducerService,
  ) {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent] });
    this.client.login(process.env.DISCORD_TOKEN_BOT)
      .then(() => console.log('bot logged in successfully'))
      .catch(console.error);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'notification' })
  async handleCron() {
    try {
      const message = `Your check in/check out is reset!`;
      await this.sendNotification(message);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  // send message to discord server
  private async sendNotification(message: string) {
    try {
      await axios.post(this.DISCORD_WEBHOOK_URL, {
        content: message,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Successfully!');
    } catch (error) {
      console.error('Failed:', error);
    }
  }

  async sendDirectMessage(message: string) {
    try {
      const user = await this.client.users.fetch(this.USER_ID);

      if (user) {
        await user.send(message);
        console.log(`Notification sent to ${user.tag}`);
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error send message by discord bot:', error);
    }
  }

  // @Cron(CronExpression.EVERY_MINUTE, { name: 'notification' })
  async testKafkaByDiscord() {
    try {
      const message = `discord notification test kafka, bro!`;
      await this.sendDirectMessage(message);
      await this.producerService.produce({
        topic: 'nest-discord',
        messages: [{ value: 'discord notification!', }],
      });
    } catch (error) {
      console.log(error);
    }
  }
}
