import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit, OnChanges {
  @Input() selectedUser: any;
  @Output() userUpdated = new EventEmitter<void>();
  isEditing: boolean = false;
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9+-]+$')]],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser'] && this.selectedUser) {
      this.userForm.patchValue(this.selectedUser);
      this.isEditing = true;
    } else {
      this.isEditing = false;
    }
  }

  initializeForm(): void {
    if (this.selectedUser) {
      this.userForm.patchValue(this.selectedUser);
      this.isEditing = true;
    } else {
      this.userForm.reset();
      this.isEditing = false;
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.isEditing && this.selectedUser) {
      this.userService
        .updateUser(this.selectedUser.id, this.userForm.value)
        .subscribe(
          () => {
            this.userUpdated.emit();
            this.userForm.reset();
            this.isEditing = false;
          },
          (error: any) => {
            console.error('Error updating user:', error);
          }
        );
    } else {
      this.userService.createUser(this.userForm.value).subscribe(
        () => {
          this.userUpdated.emit();
          this.userForm.reset();
        },
        (error: any) => {
          console.error('Error creating user:', error);
        }
      );
    }
  }
}
