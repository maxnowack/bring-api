import Base from './Base';

export default class BringApi extends Base {
  getLists() {
    return this.call({ path: `bringusers/${this.uuid}/lists` }).then(({ lists }) => lists);
  }

  getList(listId) {
    return this.call({ path: `bringlists/${listId}` });
  }

  addListItem(listId, itemName, { specification, typeName } = { typeName: 'purchase' }) {
    return this.call({
      path: `bringlists/${listId}`,
      method: 'PUT',
      data: Object.assign({
        purchase: '',
        recently: '',
        remove: '',
        requestId: '',
      }, {
        uuid: listId,
        specification,
        [typeName]: itemName,
      }),
    });
  }

  removeListItem(listId, itemName, { specification } = {}) {
    return this.addListItem(listId, itemName, { specification, typeName: 'recently' });
  }
}
