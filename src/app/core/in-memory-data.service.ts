import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const users = [
      {
        id: 1,
        firstname: 'Oliver',
        lastname: 'Baker',
        phone: '3342-1560',
        email: 'all.bake@gmail.com',
        birthday: new Date(1995, 11, 17),
        address: {
          state: {
            shortname: 'NJ',
            name: 'New Jersey',
          },
          city: 'Trenton',
          street: 'N Clinton Ave',
          zipcode: '08610',
        },
        avatar: ['https://www.thispersondoesnotexist.com/image']
      },
      {
        id: 2,
        firstname: 'George',
        lastname: 'Ball',
        phone: '3348-1571',
        email: 'GeGball@gmail.com',
        birthday: new Date(2005, 12, 11),
        address: {
          state : {
            shortname: 'TX',
            name: 'Texas',
          },
          city: 'Addison',
          street: 'Morris Ave',
          zipcode: '75001',
        },
        avatar: ['https://www.thispersondoesnotexist.com/image']
      },
      {
        id: 3,
        firstname: 'Harry',
        lastname: 'Allen',
        phone: '3383-9124',
        email: 'Hallenry@gmail.com',
        birthday: new Date(2000, 12, 15),
        address: {
          state : {
            shortname: 'HI',
            name: 'Hawaii',
          },
          city: 'Trenton',
          street: 'Olali St',
          zipcode: '96705',
        },
        avatar: ['https://www.thispersondoesnotexist.com/image']
      },
      {
        id: 4,
        firstname: 'Harry',
        lastname: 'Allen',
        phone: '3383-9124',
        email: 'Hallenry@gmail.com',
        birthday: new Date(1999, 4, 11),
        address: {
          state : {
            shortname: 'HI',
            name: 'Hawaii',
          },
          city: 'Trenton',
          street: 'Olali St',
          zipcode: '96705',
        },
        avatar: ['https://www.thispersondoesnotexist.com/image']
      },
      {
        id: 5,
        firstname: 'Harry',
        lastname: 'Allen',
        phone: '3383-9124',
        email: 'Hallenry@gmail.com',
        birthday: new Date(2003, 2, 19),
        address: {
          state : {
            shortname: 'HI',
            name: 'Hawaii',
          },
          city: 'Trenton',
          street: 'Olali St',
          zipcode: '96705',
        },
        avatar: ['https://www.thispersondoesnotexist.com/image']
      },
      {
        id: 6,
        firstname: 'Harry',
        lastname: 'Allen',
        phone: '3383-9124',
        email: 'Hallenry@gmail.com',
        birthday: new Date(1998, 6, 2),
        address: {
          state : {
            shortname: 'HI',
            name: 'Hawaii',
          },
          city: 'Trenton',
          street: 'Olali St',
          zipcode: '96705',
        },
        avatar: ['https://www.thispersondoesnotexist.com/image']
      },
      {
        id: 7,
        firstname: 'Harry',
        lastname: 'Allen',
        phone: '3383-9124',
        email: 'Hallenry@gmail.com',
        birthday: new Date(2000, 6, 17),
        address: {
          state : {
            shortname: 'HI',
            name: 'Hawaii',
          },
          city: 'Trenton',
          street: 'Olali St',
          zipcode: '96705',
        },
        avatar: ['https://www.thispersondoesnotexist.com/image']
      },
    ];
    return { users };
  }
}
