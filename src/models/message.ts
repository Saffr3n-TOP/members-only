import { Schema, model, Types } from 'mongoose';

type Message = {
  title: string;
  text: string;
  author: Types.ObjectId;
  date: Date;
};

const MessageSchema = new Schema<Message>(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    date: { type: Date, default: new Date() }
  },
  { collection: 'messages' }
);

MessageSchema.virtual('dateFormatted').get(function () {
  return this.date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
});

const Message = model<Message>('Message', MessageSchema);
export default Message;
