import mongoose, { ConnectOptions } from 'mongoose';
import config from '../config';

export default function connect() {
    mongoose.connect(
        config.database.uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions,
        err => {
            if (!err) {
                console.info('MongoDB Connection Succeeded.');
            } else {
                console.error('Error in DB connection: ' + err);
            }
        }
    );
}
