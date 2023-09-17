import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTextComponent } from './lab-text.component';

describe('LabTextComponent', () => {
  let component: LabTextComponent;
  let fixture: ComponentFixture<LabTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabTextComponent]
    });
    fixture = TestBed.createComponent(LabTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
