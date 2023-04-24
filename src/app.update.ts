import { Ctx, Hears, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { actionButtons } from './app.button';
import { AppService } from './app.service';
import { showList } from './app.utils';
import { Context } from './context.interface';

const todos = [
  {
    id: 1,
    name: 'Buy foods',
    isCompleted: false,
  },
  {
    id: 2,
    name: 'Buy Milk',
    isCompleted: true,
  },
  {
    id: 3,
    name: 'Buy Car',
    isCompleted: false,
  },
];

@Update()
export class AppUpdate {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>, private readonly appService: AppService) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi! Bitch');
    await ctx.reply('Что ты хочешь сделать ?', actionButtons());
  }

  @Hears('🗓 Список задач')
  async listTask(ctx: Context) {
    await ctx.reply(showList(todos));
  }
  @Hears('✅ Завершить')
  async doneTask(ctx: Context) {
    await ctx.reply('Напиши ID задачи: ');
    ctx.session.type = 'done';
  }

  @Hears('🖋 Редактирование')
  async editTask(ctx: Context) {
    await ctx.replyWithHTML('Напиши ID и новое название задачи: /n/n' + '<i>В формате -1 | Новое название</i>');
    ctx.session.type = 'done';
  }
  @Hears('❌ Удаление')
  async deleteTask(ctx: Context) {
    await ctx.reply('Напиши ID задачи: ');
    ctx.session.type = 'done';
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'done') {
      const todo = todos.find((todo) => todo.id === Number(message));

      if (!todo) {
        await ctx.deleteMessage();
        await ctx.reply('Задача с таким ID не найдена!');
        return;
      }
      todo.isCompleted = !todo.isCompleted;
      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'edit') {
    }

    if (ctx.session.type === 'remove') {
    }
  }
}
