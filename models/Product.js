import mongoose from "mongoose";

const allowedDeviceTypes = [
    "smartphone",
    "tablet",
    "tv",
    "keyboard",
    "mouse",
    "monitor",
    "printer",
    "laptop",
    "desktop"
];

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,
        required: true,
    },
    photoUrl: {
        type: String,
        required: true,
        validate: {
            validator: v => /^https?:\/\//.test(v),
            message: props => `${props.value} is not a valid URL!`
        }
    },
    videoUrl: {
        type: String,
        required: false,
        validate: {
            validator: v => !v || /^https?:\/\//.test(v),
            message: props => `${props.value} is not a valid URL!`
        }
    },
    deviceType: {
        type: String,
        enum: allowedDeviceTypes,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ProductModel =  mongoose.model('Product', ProductSchema);
export { ProductModel };
