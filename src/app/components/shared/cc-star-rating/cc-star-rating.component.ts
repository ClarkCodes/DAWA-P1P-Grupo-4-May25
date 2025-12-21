import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, ElementRef, forwardRef, HostBinding, inject, Input, OnDestroy, Optional, QueryList, Renderer2, Self, ViewChild, ViewChildren } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { PercentPipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-cc-star-rating',
  imports: [MatIconModule, MatTooltipModule, PercentPipe, MatSliderModule],
  templateUrl: './cc-star-rating.component.html',
  styleUrl: './cc-star-rating.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef( () => CcStarRatingComponent ),
      multi: true
    },
    {
      provide: MatFormFieldControl,
      useExisting: CcStarRatingComponent
    }
  ]
})
export class CcStarRatingComponent implements ControlValueAccessor, MatFormFieldControl<number>, OnDestroy, DoCheck { // Supports ReactiveForms integration, this is formControlName attribute on template as a custom form control and mat-form-field implementation to be inside it.
  // Dependencies Injections
  private renderer = inject( Renderer2 );
  private cdr = inject( ChangeDetectorRef );

  // --- ReadOnly Properties ---
  @Input() rating: number = 0;   // The current rating, like 4.5
  @Input() maxStars: number = 5; // Total stars ( default is 5 ) It is used in readOnly and SetMode
  @Input() setMode: boolean = false;

  // --- SetMode Properties ---
  setModeRating: number = 0; // The rating value when on Set mode to avoid conflict with the Forms and the rating with the @Input, so separated rating values are used for different modes
  starItemFocused: boolean = false;
  sliderInputFocused: boolean = false;
  @ViewChild( 'ratingSlider', { read: ElementRef } ) ratingSlider!: ElementRef<HTMLInputElement>;
  @ViewChildren( 'starIcon', { read: ElementRef } ) starIcons!: QueryList<ElementRef>;

  // --- Properties and methods for ControlValueAccessor implementation ---
  onChange: ( value: number ) => void = () => {};
  onTouched: () => void = () => {};
  _isDisabled: boolean = false;

  // --- Properties and methods for MatFormFieldControl implementation ---
  static nextId: number = 0;
  @HostBinding() id = `cc-star-rating-${CcStarRatingComponent.nextId++}`;
  stateChanges = new Subject<void>();
  focused: boolean = false;
  touched: boolean = false;
  controlType: string = 'cc-star-rating'; // A unique name for the control type
  private _placeholder: string = "";
  private _required: boolean = false;

  @Optional() @Self() ngControl!: NgControl; // This is how the component in linked to the form control passed in by the user (e.g., formControlName, ngModel). It's crucial for error handling and state.

  constructor() {}

  // --- SetMode Methods ---

  ngAfterViewInit() { // Set the rating value visually on the stars when editing an already existing comment and represent visually its rating
    if ( this.setModeRating && this.starIcons )
      this.updateStars( this.setModeRating );

    if ( this.setMode && this.ngControl != null )
      this.ngControl.valueAccessor = this;
  }

  onSliderInputValueChange( sliderInputValueChangeEvent: Event ) {
    const newRatingValue: number = Number( ( sliderInputValueChangeEvent.target as HTMLInputElement ).value );
    this.setRating( newRatingValue );
  }

  setRating( newRating: number ): void {
    if ( this._isDisabled ) return; // Ignore clicks if disabled

    this.setModeRating = newRating;
    this.updateStars( this.setModeRating );
    this.onChange( newRating ); // Notify the form that the value has changed and send the new value
    this.onTouched(); // Mark the control as touched
    this.stateChanges.next(); // Part of MatFormFieldControl Implementation
  }

  highlightStars( hoveringRating: number ): void {
    this.updateStars( hoveringRating );
  }

  resetStarsHighlight(): void {
    this.updateStars( this.setModeRating );
  }

  private updateStars( rating: number ): void {
    this.starIcons.forEach( ( iconRef, index ) => {
      const iconElement = iconRef.nativeElement;

      switch( true ) {
        case ( rating >= index + 1 ): // Full Filled Star
          this.renderer.setProperty( iconElement, 'textContent', 'star' );
          this.renderer.setStyle( iconElement, 'color', 'yellow' );
          break;

        case ( rating <= index ): // Empty Star
          this.renderer.setProperty( iconElement, 'textContent', 'star' );
          this.renderer.setStyle( iconElement, 'color', 'lightgray' );
          break;

        case ( rating > index && rating < index + 1 ): // Half Star
          this.renderer.setProperty( iconElement, 'textContent', 'star_half' );
          this.renderer.setStyle( iconElement, 'color', 'yellow' );
          break;
        default:
          break;
      }
    });
  }

  // --- ControlValueAccessor Methods ---

  writeValue( value: number ): void { // This method is called by the Forms module to update the component's value
    this.setModeRating = value || 0;

    if ( this.starIcons )
      this.updateStars( this.setModeRating );

    this.cdr.markForCheck();
  }

  registerOnChange( fn: ( value: number ) => void ): void { // Save the function to call when the component's value changes
    this.onChange = fn;
  }

  registerOnTouched( fn: () => void ): void { // Save the function to call when the component is "touched"
    this.onTouched = fn;
  }

  setDisabledState?( isDisabled: boolean ): void {
    this._isDisabled = isDisabled;
    this.cdr.markForCheck();
  }


  // --- MatFormFieldControl Getter and Setter Accessors and Methods ---

  get empty() {
    return !this.setModeRating;
  }

  @HostBinding( 'class.floating' )
  get shouldLabelFloat() {
    return true; // this.focused || !this.empty; This would be the normal logic, but in this case it is more convenient that the container mat-form-field label is always floating
  }

  @Input()
  get placeholder(): string { return this._placeholder; }
  set placeholder( placeholderValue: string ) {
    this._placeholder = placeholderValue;
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean { return this._required; }
  set required( value: BooleanInput ) {
    this._required = coerceBooleanProperty( value );
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean { return this._isDisabled; }
  set disabled( value: BooleanInput ) {
    this._isDisabled = coerceBooleanProperty( value );
    this.stateChanges.next();
  }

  @Input()
  get value(): number { return this.setModeRating; }
  set value( newValue: number ) {
    this.setModeRating = newValue;
    this.stateChanges.next();
  }

  get errorState(): boolean { // --- Error State Logic --- The control is in an error state if it's invalid, and has been touched or is dirty.
    return !!this.ngControl?.invalid && ( this.touched || ( this.ngControl?.dirty ?? false ) );
  }

  setDescribedByIds( ids: string[] ) {} // This is required by the interface but it is often left empty, it's used for accessibility with aria-describedby.

  onContainerClick( event: MouseEvent ) { // This is called when the user clicks on the mat-form-field container, it should focus the inner input element.
    this.onFocusIn();

    if ( this.ratingSlider )
      this.ratingSlider.nativeElement.focus();
  }

  // --- Lifecycle and Change Detection ---

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  ngDoCheck() {
    if ( this.ngControl ) {
      this.touched = this.ngControl.touched ?? false;
      this.stateChanges.next();
    }
  }

  // --- Focusing Logic ---

  onFocusIn() {
    if ( !this.focused ) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut( event: FocusEvent ) {
    this.starRatingFocusOut();
  }

  onStarItemFocusIn() {
    this.starItemFocused = true;
  }

  onStarItemFocusOut() {
    this.starItemFocused = false;
    this.starRatingFocusOut();
  }

  onSliderInputFocusIn() {
    this.sliderInputFocused = true;
  }

  onSliderInputFocusOut() {
    this.sliderInputFocused = false;
    this.starRatingFocusOut();
  }

  starRatingFocusOut() {
    if ( this.focused && !this.starItemFocused && !this.sliderInputFocused ) {
      if ( !this.touched )
        this.touched = true;

      if ( this.focused )
        this.focused = false;

      this.onTouched(); // From ControlValueAccessor
      this.stateChanges.next();
    }
  }

}
