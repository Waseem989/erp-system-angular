import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSection } from './class-section';

describe('ClassSection', () => {
  let component: ClassSection;
  let fixture: ComponentFixture<ClassSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
