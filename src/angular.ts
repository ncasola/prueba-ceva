// Angular
// Exercice: Is there a problem and improve the code (5 points)

// Original code
@Component({
    selector: 'app-users',
    template: `
      <input type="text" [(ngModel)]="query" (ngModelChange)="querySubject.next($event)">
      <div *ngFor="let user of users">
          {{ user.email }}
      </div>
    `
  })
  export class AppUsers implements OnInit {
  
    query = '';
    querySubject = new Subject<string>();
  
    users: { email: string; }[] = [];
  
    constructor(
      private userService: UserService
    ) {
    }
  
    ngOnInit(): void {
      concat(
        of(this.query),
        this.querySubject.asObservable()
      ).pipe(
        concatMap(q =>
          timer(0, 60000).pipe(
            this.userService.findUsers(q)
          )
        )
      ).subscribe({
        next: (res) => this.users = res
      });
    }
  }
  
  // Improved code

  @Component({
    selector: 'app-users',
    template: `
      <input type="text" [(ngModel)]="query" (ngModelChange)="querySubject.next($event)">
      <div *ngFor="let user of users">
          {{ user.email }}
      </div>
    `
  })
  export class AppUsers implements OnInit, OnDestroy {
    query = '';
    querySubject = new Subject<string>();
    users: { email: string; }[] = [];
    private destroy$ = new Subject<void>();
  
    constructor(private userService: UserService) {}
  
    ngOnInit(): void {
      concat(of(this.query), this.querySubject.asObservable())
        .pipe(
          debounceTime(300), // Adjust the debounce time as needed
          concatMap(q => timer(0, 60000).pipe(this.userService.findUsers(q))),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (res) => (this.users = res)
        });
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }

// Exercice: Improve performance (5 points)

// Original code
@Component({
    selector: 'app-users',
    template: `
      <div *ngFor="let user of users">
          {{ getCapitalizeFirstWord(user.name) }}
      </div>
    `
  })
  export class AppUsers {
  
    @Input()
    users: { name: string; }[];
  
    constructor() {}
    
    getCapitalizeFirstWord(name: string): string {
      return name.split(' ').map(n => n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()).join(' ');
    }
  }

  export function getCapitalizeFirstWord(name: string): string {
    return name.split(' ').map(n => n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()).join(' ');
  }
  
  // Improved code
  @Component({
    selector: 'app-users',
    template: `
      <div *ngFor="let user of users; trackBy: trackByFn">
          {{ getCapitalizeFirstWord(user.name) }}
      </div>
    `
  })
  export class AppUsers {
    @Input()
    users: { name: string; }[];
  
    constructor() {}
  
    trackByFn(index: number, item: any): any {
      return item.name; // Assuming 'name' is a unique identifier for each user
    }
  }
  
// Exercice: Forms (8 points)
// Complete and modify AppUserForm class to use Angular Reactive Forms. Add a button to submit.

// Original code
@Component({
    selector: 'app-user-form',
    template: `
      <form>
          <input type="text" placeholder="email">
          <input type="text" placeholder="name">
          <input type="date" placeholder="birthday">
          <input type="number" placeholder="zip">
          <input type="text" placeholder="city">
      </form>
    `
  })
  export class AppUserForm {
  
    @Output()
    event = new EventEmitter<{ email: string; name: string; birthday: Date; address: { zip: number; city: string; };}>;
    
    constructor(
      private formBuilder: FormBuilder
    ) {
    }
  
    doSubmit(): void {
      this.event.emit(...);
    }
  }

    // Improved code

    @Component({
        selector: 'app-user-form',
        template: `
            <form [formGroup]="userForm" (ngSubmit)="doSubmit()">
                <input type="text" placeholder="email" formControlName="email">
                <input type="text" placeholder="name" formControlName="name">
                <input type="date" placeholder="birthday" formControlName="birthday">
                <input type="number" placeholder="zip" formControlName="zip">
                <input type="text" placeholder="city" formControlName="city">
                <button type="submit">Submit</button>
            </form>
        `
    })
    export class AppUserForm {
        @Output() event = new EventEmitter<{
            email: string;
            name: string;
            birthday: Date;
            address: { zip: number; city: string };
        }>();

        userForm: FormGroup;

        constructor(private formBuilder: FormBuilder) {
            this.userForm = this.formBuilder.group({
                email: '',
                name: '',
                birthday: '',
                zip: '',
                city: ''
            });
        }

        doSubmit(): void {
            if (this.userForm.valid) {
                const { email, name, birthday, zip, city } = this.userForm.value;
                const user = {
                    email,
                    name,
                    birthday,
                    address: { zip, city }
                };
                this.event.emit(user);
            }
        }
    }
  