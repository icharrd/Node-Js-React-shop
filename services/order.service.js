const boom = require('@hapi/boom');
const {models} = require('../libs/sequelize');
class OrderService {

  constructor(){
  }

  async create(data){
    // Accedemos al modelo Customer y usando where encadenamos hacia user
    const customer = await models.Customer.findOne({
      where: {
        '$user.id$': data.userId
      },
      include: ['user']
    });
    // Validamos que exista el customer
    if (!customer) {
      throw boom.notFound('Customer not found');
    }
    // Creamos un objeto con el customerId obtenido de la consulta
    const dataOrder = {
      customerId: customer.id
    };
    const newOrder = await models.Order.create(dataOrder);
    return newOrder;
  }

async addItem(data){
  const newItem = await models.OrderProduct.create(data);
    return newItem;
}

async findByUser(userId) {
  const orders = await models.Order.findAll({
    where: {
      '$customer.user.id$': userId
    },
    include:[
      {
        association:'customer',
        include: ['user']
      }
    ]
  });
  return orders;
  }


  async find() {
  return [];
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id,{
      include:[
        {
          association:'customer',
          include: ['user']
        },
        'items'
      ]
    });
    return order;
  }

  async update(id, changes) {
    return {
      id,
      changes,
    };
  }

  async delete(id) {
    return { id };
  }

}

module.exports = OrderService;
