import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { SettingsService } from '../settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-setup',
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.scss'],
})
export class GameSetupComponent implements OnDestroy {
  selectedOption = 1;

  settingsForm: FormGroup;
  maxMines: number = 3;
  minDimentions = 2;
  maxDimentions = 50;

  private formSubscriptions: (Subscription | undefined)[] = [];

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {
    const initialSettings = this.settingsService.getGameSettings();
    this.settingsForm = this.fb.group({
      width: [
        initialSettings.width,
        [
          Validators.required,
          Validators.min(this.minDimentions),
          Validators.max(this.maxDimentions),
        ],
      ],
      height: [
        initialSettings.height,
        [
          Validators.required,
          Validators.min(this.minDimentions),
          Validators.max(this.maxDimentions),
        ],
      ],
      mines: [
        initialSettings.mines,
        [
          Validators.required,
          Validators.min(1),
          (control: AbstractControl) => {
            const width = this.settingsForm?.get('width')?.value ?? 0;
            const height = this.settingsForm?.get('height')?.value ?? 0;
            const maxMines = width * height - 1;
            return control.value > maxMines ? { minesTooHigh: true } : null;
          },
        ],
      ],
    });
    this.selectedOption = initialSettings.difficulty;
    this.setDifficulty(this.selectedOption);
    this.formSubscriptions.push(
      this.settingsForm.get('width')?.valueChanges.subscribe(() => {
        this.settingsForm.get('mines')?.updateValueAndValidity();
      })
    );
    this.formSubscriptions.push(
      this.settingsForm.get('height')?.valueChanges.subscribe(() => {
        this.settingsForm.get('mines')?.updateValueAndValidity();
      })
    );
  }

  ngOnDestroy() {
    this.formSubscriptions.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  setDifficulty = (val: number) => {
    this.selectedOption = val;
    switch (val) {
      case 1:
        this.settingsForm.patchValue({ width: 9, height: 9, mines: 10 });
        break;
      case 2:
        this.settingsForm.patchValue({ width: 16, height: 16, mines: 40 });
        break;
      case 3:
        this.settingsForm.patchValue({ width: 30, height: 16, mines: 99 });
        break;
    }
    this.saveSettings();
  };

  saveSettings = () => {
    this.settingsService.setGameSettings({
      difficulty: this.selectedOption,
      ...this.settingsForm.value,
    });
  };

  getError(field: string): string {
    if(this.settingsForm.get(field)?.hasError('required')) {
      return 'This field is required.'
    }

    if(this.settingsForm.get(field)?.hasError('min')) {
      return `This field must have a minimum value of ${field !== 'mines' ? this.minDimentions : 1}.`
    }

    if(this.settingsForm.get(field)?.hasError('max')) {
      return `This field must have a maximum value of ${this.maxDimentions}.`
    }

    if(this.settingsForm.get(field)?.hasError('minesTooHigh')) {
      return `The amount of mines is too high.`
    }

    return 'Invalid Value';
  }
}
