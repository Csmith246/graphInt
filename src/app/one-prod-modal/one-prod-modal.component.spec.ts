import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneProdModalComponent } from './one-prod-modal.component';

describe('OneProdModalComponent', () => {
  let component: OneProdModalComponent;
  let fixture: ComponentFixture<OneProdModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneProdModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneProdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
