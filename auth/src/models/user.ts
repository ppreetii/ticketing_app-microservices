import mongoose from "mongoose";

//interface describing properties needed to create a user
interface UserAttrs {
    email:string;
    password: string;
}

//interface describing properties of User Model
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

//interface describing properties that a User document has, one that is returned by Mongo
interface UserDoc extends mongoose.Document {
    email:string;
    password:string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

userSchema.statics.build = (attrs: UserAttrs) =>{
    return new User(attrs);
}

const User = mongoose.model<UserDoc,UserModel>('User', userSchema);

export {User};