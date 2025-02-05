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
import { numericValidator } from '../../utils/number.validator';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
      contact: ['', [Validators.required, numericValidator]],
    });
  }

  ngOnInit(): void {
    if (this.selectedUser) {
      this.userForm.patchValue(this.selectedUser);
      this.isEditing = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser'] && this.selectedUser) {
      this.userForm.patchValue(this.selectedUser);
      this.isEditing = true;
    } else {
      this.isEditing = false;
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
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
}
