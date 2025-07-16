const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Todo text is required'],
    trim: true,
    maxlength: [200, 'Todo text cannot exceed 200 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Todo must belong to a user']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
todoSchema.index({ user: 1, completed: 1 });
todoSchema.index({ user: 1, createdAt: -1 });

// Virtual for formatted due date
todoSchema.virtual('dueDateFormatted').get(function() {
  if (!this.dueDate) return null;
  return this.dueDate.toLocaleDateString();
});

// Virtual for overdue status
todoSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.completed) return false;
  return new Date() > this.dueDate;
});

// Instance method to mark as complete
todoSchema.methods.markComplete = function() {
  this.completed = true;
  return this.save();
};

// Instance method to mark as incomplete
todoSchema.methods.markIncomplete = function() {
  this.completed = false;
  return this.save();
};

// Static method to get todos by user
todoSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to get completed todos by user
todoSchema.statics.findCompletedByUser = function(userId) {
  return this.find({ user: userId, completed: true }).sort({ createdAt: -1 });
};

// Static method to get pending todos by user
todoSchema.statics.findPendingByUser = function(userId) {
  return this.find({ user: userId, completed: false }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Todo', todoSchema); 