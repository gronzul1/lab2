import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MngdataComponent } from './mngdata.component';

describe('MngdataComponent', () => {
  let component: MngdataComponent;
  let fixture: ComponentFixture<MngdataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MngdataComponent]
    });
    fixture = TestBed.createComponent(MngdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
