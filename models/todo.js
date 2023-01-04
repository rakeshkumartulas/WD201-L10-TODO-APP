/* eslint-disable require-jsdoc */
'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
       static associate(models) {
        Todo.belongsTo(models.User,{
          foreignKey: 'userId'
        })

          }

    static addTodo({title, dueDate, userId}) {
      return this.create({title: title, dueDate: dueDate, completed: false,userId});
    }

    static getTodos(){
      return this.findAll();
    }

    static async overdue(userId) {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date().toLocaleDateString("en-CA") },
          completed: false,
          userId,
        },
      });
    }

    static async dueToday(userId) {
      
      return await Todo.findAll({
        where: {
          dueDate: { [Op.eq]: new Date().toLocaleDateString("en-CA") },
          completed: false,
          userId,
        },
      });
    }

    static async dueLater(userId) {
      
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date().toLocaleDateString("en-CA") },
          completed: false,
          userId,
        },
      });
    }

    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      })
    }

    static async completedItems(userId){
      return this.findAll({
        where: {
          completed: true,
          userId,
        }
      })
    }
    setCompletionStatus(receiver) {
      return this.update({ completed: receiver });
    }
    
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};
