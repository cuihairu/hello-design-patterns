# MVVM

#### Overview

MVVM (Model-View-ViewModel) is a software architecture design pattern commonly used to build modern user interface applications. It is based on the MVC pattern and adds a ViewModel layer on top of it. The main goal of MVVM is to separate the user interface (View) from the business logic (ViewModel), thereby improving the maintainability, testability, and extensibility of the code.

#### Components

1. **Model**
   - **Responsibility**: Handles the application's data logic. The model is responsible for storing and managing data and for business rules.
   - **Example**: In a to-do application, the model might include a Task class that holds the task's properties and operations.

2. **View**
   - **Responsibility**: Responsible for presenting the user interface. The view is what the user sees and interacts with.
   - **Example**: In a to-do application, the view might be the screen that displays the task list.

3. **ViewModel**
   - **Responsibility**: Converts model data into a form the view can use and handles the interaction between the view and the model. The ViewModel is the bridge between View and Model.
   - **Example**: In a to-do application, the ViewModel might hold the collection of tasks and provide methods to add and remove tasks.

#### Advantages

- **Separation of concerns**: Separating data logic from the user interface makes development and maintenance easier.
- **Testability**: Business logic lives in the ViewModel layer, so it can be unit tested independently of the view.
- **Two-way data binding**: The view and the ViewModel can be bound both ways, keeping UI updates and data updates in sync.

#### Disadvantages

- **Added complexity**: For small applications, introducing MVVM may add unnecessary complexity.
- **Learning cost**: Developers need to understand and get familiar with the concepts and implementation of the MVVM pattern.

#### Use cases

- **Desktop applications**: Such as WPF and Xamarin applications.
- **Web applications**: Such as single-page applications built with Knockout.js or Vue.js.
- **Mobile applications**: Such as apps built with Android's DataBinding library.

#### Example code

##### C# example (WPF)

1. **Model**

```csharp
public class Task {
    public string Title { get; set; }
    public bool IsCompleted { get; set; }
}
```

2. **View** (MainWindow.xaml)

```xml
<Window x:Class="MVVMExample.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="MainWindow" Height="350" Width="525">
    <Grid>
        <ListBox ItemsSource="{Binding Tasks}">
            <ListBox.ItemTemplate>
                <DataTemplate>
                    <StackPanel Orientation="Horizontal">
                        <CheckBox IsChecked="{Binding IsCompleted}"/>
                        <TextBlock Text="{Binding Title}" Margin="5,0,0,0"/>
                    </StackPanel>
                </DataTemplate>
            </ListBox.ItemTemplate>
        </ListBox>
        <Button Content="Add Task" Command="{Binding AddTaskCommand}" VerticalAlignment="Bottom"/>
    </Grid>
</Window>
```

3. **ViewModel**

```csharp
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;

public class MainViewModel : INotifyPropertyChanged {
    private ObservableCollection<Task> tasks;
    public ObservableCollection<Task> Tasks {
        get { return tasks; }
        set { tasks = value; OnPropertyChanged(); }
    }

    public ICommand AddTaskCommand { get; }

    public MainViewModel() {
        Tasks = new ObservableCollection<Task> {
            new Task { Title = "Task 1", IsCompleted = false },
            new Task { Title = "Task 2", IsCompleted = true }
        };

        AddTaskCommand = new RelayCommand(AddTask);
    }

    private void AddTask() {
        Tasks.Add(new Task { Title = "New Task", IsCompleted = false });
    }

    public event PropertyChangedEventHandler PropertyChanged;

    protected void OnPropertyChanged([CallerMemberName] string propertyName = null) {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
```

4. **Command implementation (RelayCommand)**

```csharp
using System;
using System.Windows.Input;

public class RelayCommand : ICommand {
    private readonly Action execute;
    private readonly Func<bool> canExecute;

    public RelayCommand(Action execute, Func<bool> canExecute = null) {
        this.execute = execute ?? throw new ArgumentNullException(nameof(execute));
        this.canExecute = canExecute;
    }

    public bool CanExecute(object parameter) {
        return canExecute == null || canExecute();
    }

    public void Execute(object parameter) {
        execute();
    }

    public event EventHandler CanExecuteChanged {
        add { CommandManager.RequerySuggested += value; }
        remove { CommandManager.RequerySuggested -= value; }
    }
}
```

5. **Code binding (MainWindow.xaml.cs)**

```csharp
public partial class MainWindow : Window {
    public MainWindow() {
        InitializeComponent();
        DataContext = new MainViewModel();
    }
}
```

##### JavaScript example (Vue.js)

1. **HTML view (index.html)**

```html
<!DOCTYPE html>
<html>
<head>
    <title>MVVM Example</title>
</head>
<body>
    <div id="app">
        <ul>
            <li v-for="task in tasks">
                <input type="checkbox" v-model="task.isCompleted">
                {{ task.title }}
            </li>
        </ul>
        <button @click="addTask">Add Task</button>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
    <script src="app.js"></script>
</body>
</html>
```

2. **ViewModel (app.js)**

```javascript
new Vue({
    el: '#app',
    data: {
        tasks: [
            { title: 'Task 1', isCompleted: false },
            { title: 'Task 2', isCompleted: true }
        ]
    },
    methods: {
        addTask() {
            this.tasks.push({ title: 'New Task', isCompleted: false });
        }
    }
});
```

### Summary

The MVVM pattern introduces a ViewModel layer to separate the view from the model, achieving greater modularity, maintainability, and testability. It is very popular in modern user interface development and fits a wide range of scenarios, from desktop and web to mobile applications. The example code in different programming languages above shows how widely applicable and powerful the MVVM pattern is.

## Sources

- [Wikipedia · Model–view–viewmodel](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)
- [MSDN Magazine · MVVM](https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/patterns-wpf-apps-with-the-model-view-viewmodel-design-pattern) (the classic exposition after Gossman's original 2005 proposal, [S24])

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [overview](overview.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
