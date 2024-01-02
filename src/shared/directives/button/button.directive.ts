import { Attribute, Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'button[stPrimaryBtn],button[stSecondaryBtn],button[stGhostBtn],button[stLinkBtn]',
})
export class ButtonDirective {

  constructor(@Attribute('large') large: any,
              @Attribute('shadow') shadow: any
  ) { }

  @HostBinding('class.st-button')
  get addStClass(): boolean {
    return true;
  }
}
