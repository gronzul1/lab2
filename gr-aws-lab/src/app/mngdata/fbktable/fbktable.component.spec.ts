import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbktableComponent } from './fbktable.component';

describe('FbktableComponent', () => {
  let component: FbktableComponent;
  let fixture: ComponentFixture<FbktableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FbktableComponent]
    });
    fixture = TestBed.createComponent(FbktableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
