import { UserModel } from '@app/users/models';
import { RouterParams } from '@app/core/interfaces';
import { convertDate } from '@app/utils';

export function routerFilter (data: UserModel[], filter: RouterParams) {
  return data.filter((element: UserModel) => {
    let condition = true;
    if (filter.usersId && filter.usersId.length) {
      condition = condition && filter.usersId.includes(element.id);
    }

    if (filter.phone) {
      const userPhone = element.phone.replace(/[^\d]/, '');
      condition = condition && userPhone.includes(filter.phone);
    }

    if (filter.state) {
      condition = condition && filter.state === element.address.state.shortname;
    }

    if (filter.dateStart || filter.dateEnd) {
      debugger;
      const birthday = element.birthday.toISOString().slice(0,10);

      if (filter.dateStart) {
        condition = condition && convertDate(filter.dateStart) <= birthday;
      }

      if (filter.dateEnd) {
        condition = condition && convertDate(filter.dateEnd) >= birthday;
      }
    }

    return condition;
  })
}