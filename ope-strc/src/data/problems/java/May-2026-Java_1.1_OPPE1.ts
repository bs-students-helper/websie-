import { Problem } from '../../../types/problem';

export const javaOPPE1RealProblems: Problem[] = [
  // ---------------------------------------------------------------
  // Problem 1: Complex Number Operations using Copy Constructor
  // ---------------------------------------------------------------
  {
    id: 'java-oppe1-p1',
    title: 'Complex Number Operations using Copy Constructor',
    subject: 'Programming in Java',
    subjectId: 'java',
    week: 'Week 3',
    topic: 'Constructors & Copy Constructor',
    difficulty: 'Easy',
    language: 'java',
    fileName: 'FClass.java',
    description: `Create a Java program for handling complex numbers with copy constructors.

Define a class \`ComplexNumber\` that has the following members:
- Instance variables: \`real\` (double), \`imaginary\` (double).
- Constructor \`ComplexNumber(double real, double imaginary)\`: sets initial real and imaginary parts.
- Copy Constructor \`ComplexNumber(ComplexNumber other)\`: creates a new \`ComplexNumber\` object with the same values as \`other\`.
- Method \`add(ComplexNumber c)\`: returns a new \`ComplexNumber\` representing the sum of this and \`c\`.
- Method \`display()\`: prints the complex number in the format \`real + imaginary i\` (e.g. \`5.0 + 3.0i\`).`,
    inputFormat: 'First line: real and imaginary parts of first complex number. Second line: real and imaginary parts of second complex number.',
    outputFormat: 'Prints complex number addition result and verifies copy constructor immutability.',
    constraints: ['Values are double precision floating numbers.'],
    requirements: [
      'Define class ComplexNumber with real and imaginary fields.',
      'Implement parameterized constructor and copy constructor ComplexNumber(ComplexNumber other).',
      'Implement method add(ComplexNumber c) and display().',
    ],
    starterCode: `import java.util.*;

class ComplexNumber {
    private double real;
    private double imaginary;

    // Parameterized Constructor
    public ComplexNumber(double real, double imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    }

    // Copy Constructor
    public ComplexNumber(ComplexNumber other) {
        // Write your code here
    }

    public ComplexNumber add(ComplexNumber c) {
        // Write your code here
        return new ComplexNumber(this.real + c.real, this.imaginary + c.imaginary);
    }

    public void display() {
        System.out.println(real + " + " + imaginary + "i");
    }
}

class FClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double r1 = sc.nextDouble();
        double i1 = sc.nextDouble();
        double r2 = sc.nextDouble();
        double i2 = sc.nextDouble();

        ComplexNumber c1 = new ComplexNumber(r1, i1);
        ComplexNumber c2 = new ComplexNumber(r2, i2);

        // Test copy constructor
        ComplexNumber copyC1 = new ComplexNumber(c1);
        ComplexNumber sum = copyC1.add(c2);

        sum.display();
    }
}`,
    testCases: [
      {
        id: 1,
        name: 'Case 1',
        isPublic: true,
        input: '3.5 2.5\n1.5 4.5',
        expectedOutput: '5.0 + 7.0i',
        weight: 50,
      },
      {
        id: 2,
        name: 'Case 2',
        isPublic: true,
        input: '10.0 5.0\n-2.0 -3.0',
        expectedOutput: '8.0 + 2.0i',
        weight: 50,
      },
    ],
    solutionVisibility: 'always',
    oppeType: 'oppe1',
    year: '2024',
    term: 'May 2026',
    setName: 'Set 1',
    setProblemNumber: 1,
    tags: ['OOP', 'Copy Constructor', 'Java'],
  },

  // ---------------------------------------------------------------
  // Problem 2: Food Delivery App using Copy Constructor
  // ---------------------------------------------------------------
  {
    id: 'java-oppe1-p2',
    title: 'Food Delivery App using Copy Constructor',
    subject: 'Programming in Java',
    subjectId: 'java',
    week: 'Week 3',
    topic: 'Constructors & Copy Constructor',
    difficulty: 'Easy',
    language: 'java',
    fileName: 'FClass.java',
    description: `In a food delivery app, \`DeliveryPartner\` is a class designed to store driver details. Write a Java program that creates an initial object for a delivery partner, creates a second instance via a copy constructor, and updates the first instance without affecting the second instance.

Define class \`DeliveryPartner\` that has the following members:
- Private Instance variables: \`name\` (String), \`rating\` (double), \`totalOrders\` (int).
- Parameterized Constructor \`DeliveryPartner(String name, double rating, int totalOrders)\`.
- Copy Constructor \`DeliveryPartner(DeliveryPartner partner)\`: creates a copy of the delivery partner.
- Getters and Setters for \`name\`, \`rating\`, \`totalOrders\`.
- Method \`display()\`: prints driver details in format \`Partner: <name>, Rating: <rating>, Orders: <totalOrders>\`.`,
    inputFormat: 'First line: name (String), rating (double), totalOrders (int). Second line: updated rating for original partner.',
    outputFormat: 'Prints details of modified original partner and unmodified copied partner.',
    constraints: ['Rating is double between 1.0 and 5.0.'],
    requirements: [
      'Define class DeliveryPartner with name, rating, totalOrders.',
      'Implement copy constructor DeliveryPartner(DeliveryPartner partner).',
      'Implement getters/setters and display() method.',
    ],
    starterCode: `import java.util.*;

class DeliveryPartner {
    private String name;
    private double rating;
    private int totalOrders;

    public DeliveryPartner(String name, double rating, int totalOrders) {
        this.name = name;
        this.rating = rating;
        this.totalOrders = totalOrders;
    }

    // Copy Constructor
    public DeliveryPartner(DeliveryPartner partner) {
        // Write your code here
    }

    public String getName() { return name; }
    public double getRating() { return rating; }
    public int getTotalOrders() { return totalOrders; }

    public void setRating(double rating) { this.rating = rating; }

    public void display() {
        System.out.println("Partner: " + name + ", Rating: " + rating + ", Orders: " + totalOrders);
    }
}

class FClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        double rating = sc.nextDouble();
        int orders = sc.nextInt();
        double newRating = sc.nextDouble();

        DeliveryPartner p1 = new DeliveryPartner(name, rating, orders);
        DeliveryPartner p2 = new DeliveryPartner(p1);

        p1.setRating(newRating);

        p1.display();
        p2.display();
    }
}`,
    testCases: [
      {
        id: 1,
        name: 'Case 1',
        isPublic: true,
        input: 'Rahul 4.5 120 4.9',
        expectedOutput: 'Partner: Rahul, Rating: 4.9, Orders: 120\nPartner: Rahul, Rating: 4.5, Orders: 120',
        weight: 50,
      },
      {
        id: 2,
        name: 'Case 2',
        isPublic: true,
        input: 'Priya 4.8 350 5.0',
        expectedOutput: 'Partner: Priya, Rating: 5.0, Orders: 350\nPartner: Priya, Rating: 4.8, Orders: 350',
        weight: 50,
      },
    ],
    solutionVisibility: 'always',
    oppeType: 'oppe1',
    year: '2024',
    term: 'May 2026',
    setName: 'Set 1',
    setProblemNumber: 2,
    tags: ['OOP', 'Copy Constructor', 'Java'],
  },

  // ---------------------------------------------------------------
  // Problem 3: Chat Application using Interfaces
  // ---------------------------------------------------------------
  {
    id: 'java-oppe1-p3',
    title: 'Chat Application using Interfaces',
    subject: 'Programming in Java',
    subjectId: 'java',
    week: 'Week 5',
    topic: 'Interfaces & Polymorphism',
    difficulty: 'Medium',
    language: 'java',
    fileName: 'FClass.java',
    description: `In a chat application, users send both text messages and media files. Complete the Java program using interfaces.

- Interface \`Message\`: defines method \`void send()\`.
- Class \`TextMessage\` implements \`Message\`:
  - Instance variables: \`sender\` (String), \`content\` (String).
  - Constructor \`TextMessage(String sender, String content)\`.
  - Method \`send()\`: prints \`[Text] <sender>: <content>\`.
- Class \`MediaMessage\` implements \`Message\`:
  - Instance variables: \`sender\` (String), \`mediaType\` (String), \`fileSize\` (double).
  - Constructor \`MediaMessage(String sender, String mediaType, double fileSize)\`.
  - Method \`send()\`: prints \`[Media] <sender> sent <mediaType> (<fileSize> MB)\`.`,
    inputFormat: 'First line: text message sender and content. Second line: media message sender, mediaType, fileSize.',
    outputFormat: 'Prints sent message details for both text and media messages.',
    constraints: ['fileSize is positive double.'],
    requirements: [
      'Define interface Message with method void send().',
      'Implement TextMessage and MediaMessage implementing Message interface.',
    ],
    starterCode: `import java.util.*;

interface Message {
    void send();
}

class TextMessage implements Message {
    private String sender;
    private String content;

    public TextMessage(String sender, String content) {
        this.sender = sender;
        this.content = content;
    }

    @Override
    public void send() {
        // Write your code here
    }
}

class MediaMessage implements Message {
    private String sender;
    private String mediaType;
    private double fileSize;

    public MediaMessage(String sender, String mediaType, double fileSize) {
        this.sender = sender;
        this.mediaType = mediaType;
        this.fileSize = fileSize;
    }

    @Override
    public void send() {
        // Write your code here
    }
}

class FClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.next();
        String txt = sc.next();
        String s2 = sc.next();
        String type = sc.next();
        double size = sc.nextDouble();

        Message m1 = new TextMessage(s1, txt);
        Message m2 = new MediaMessage(s2, type, size);

        m1.send();
        m2.send();
    }
}`,
    testCases: [
      {
        id: 1,
        name: 'Case 1',
        isPublic: true,
        input: 'Alice Hello Bob Image 2.5',
        expectedOutput: '[Text] Alice: Hello\n[Media] Bob sent Image (2.5 MB)',
        weight: 50,
      },
    ],
    solutionVisibility: 'always',
    oppeType: 'oppe1',
    year: '2024',
    term: 'May 2026',
    setName: 'Set 1',
    setProblemNumber: 3,
    tags: ['Interfaces', 'Polymorphism', 'Java'],
  },

  // ---------------------------------------------------------------
  // Problem 4: Student Learning App using Interfaces
  // ---------------------------------------------------------------
  {
    id: 'java-oppe1-p4',
    title: 'Student Learning App using Interfaces',
    subject: 'Programming in Java',
    subjectId: 'java',
    week: 'Week 5',
    topic: 'Interfaces & Polymorphism',
    difficulty: 'Medium',
    language: 'java',
    fileName: 'FClass.java',
    description: `A student learning app tracks course component progress. Complete the Java program based on interface criteria.

- Interface \`LearningItem\`: defines method \`void displayDetails()\`.
- Class \`VideoLesson\` implements \`LearningItem\`:
  - Instance variables: \`title\` (String), \`durationMinutes\` (int).
  - Method \`displayDetails()\`: prints \`Video: <title> (<durationMinutes> mins)\`.
- Class \`QuizAssignment\` implements \`LearningItem\`:
  - Instance variables: \`title\` (String), \`totalQuestions\` (int).
  - Method \`displayDetails()\`: prints \`Quiz: <title> (<totalQuestions> questions)\`.`,
    inputFormat: 'First line: video title and duration. Second line: quiz title and totalQuestions.',
    outputFormat: 'Prints details of both video lesson and quiz assignment.',
    constraints: ['durationMinutes and totalQuestions are positive integers.'],
    requirements: [
      'Define interface LearningItem with void displayDetails().',
      'Implement VideoLesson and QuizAssignment classes implementing LearningItem.',
    ],
    starterCode: `import java.util.*;

interface LearningItem {
    void displayDetails();
}

class VideoLesson implements LearningItem {
    private String title;
    private int durationMinutes;

    public VideoLesson(String title, int durationMinutes) {
        this.title = title;
        this.durationMinutes = durationMinutes;
    }

    @Override
    public void displayDetails() {
        // Write your code here
    }
}

class QuizAssignment implements LearningItem {
    private String title;
    private int totalQuestions;

    public QuizAssignment(String title, int totalQuestions) {
        this.title = title;
        this.totalQuestions = totalQuestions;
    }

    @Override
    public void displayDetails() {
        // Write your code here
    }
}

class FClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String vTitle = sc.next();
        int vDur = sc.nextInt();
        String qTitle = sc.next();
        int qNum = sc.nextInt();

        LearningItem item1 = new VideoLesson(vTitle, vDur);
        LearningItem item2 = new QuizAssignment(qTitle, qNum);

        item1.displayDetails();
        item2.displayDetails();
    }
}`,
    testCases: [
      {
        id: 1,
        name: 'Case 1',
        isPublic: true,
        input: 'Inheritance 45 JavaQuiz 10',
        expectedOutput: 'Video: Inheritance (45 mins)\nQuiz: JavaQuiz (10 questions)',
        weight: 50,
      },
    ],
    solutionVisibility: 'always',
    oppeType: 'oppe1',
    year: '2024',
    term: 'May 2026',
    setName: 'Set 1',
    setProblemNumber: 4,
    tags: ['Interfaces', 'Polymorphism', 'Java'],
  },

  // ---------------------------------------------------------------
  // Problem 5: Stock and Brokerage - Inheritance
  // ---------------------------------------------------------------
  {
    id: 'java-oppe1-p5',
    title: 'Stock and Brokerage - Inheritance',
    subject: 'Programming in Java',
    subjectId: 'java',
    week: 'Week 4',
    topic: 'Inheritance & Method Overriding',
    difficulty: 'Medium',
    language: 'java',
    fileName: 'FClass.java',
    description: `A stock brokerage system tracks order details and calculates brokerage fee for different order types.

Class \`Order\` has the following members:
- Instance variables: \`orderId\` (int), \`symbol\` (String), \`quantity\` (int), \`price\` (double).
- Constructor \`Order(int orderId, String symbol, int quantity, double price)\`.
- Method \`calculateBrokerage()\`: returns \`0.0\`.

Class \`EquityOrder\` extends \`Order\`:
- Overrides \`calculateBrokerage()\`: returns \`0.0005 * quantity * price\` (0.05% of order value).

Class \`OptionsOrder\` extends \`Order\`:
- Overrides \`calculateBrokerage()\`: returns flat fee of \`20.0\`.`,
    inputFormat: 'First line: equity order info (orderId, symbol, quantity, price). Second line: options order info.',
    outputFormat: 'Prints brokerage for equity order and options order.',
    constraints: ['quantity > 0, price > 0.'],
    requirements: [
      'Define base class Order.',
      'Define EquityOrder extending Order overriding calculateBrokerage().',
      'Define OptionsOrder extending Order overriding calculateBrokerage().',
    ],
    starterCode: `import java.util.*;

class Order {
    protected int orderId;
    protected String symbol;
    protected int quantity;
    protected double price;

    public Order(int orderId, String symbol, int quantity, double price) {
        this.orderId = orderId;
        this.symbol = symbol;
        this.quantity = quantity;
        this.price = price;
    }

    public double calculateBrokerage() {
        return 0.0;
    }
}

class EquityOrder extends Order {
    public EquityOrder(int orderId, String symbol, int quantity, double price) {
        super(orderId, symbol, quantity, price);
    }

    @Override
    public double calculateBrokerage() {
        // Write your code here
        return 0.0005 * quantity * price;
    }
}

class OptionsOrder extends Order {
    public OptionsOrder(int orderId, String symbol, int quantity, double price) {
        super(orderId, symbol, quantity, price);
    }

    @Override
    public double calculateBrokerage() {
        // Write your code here
        return 20.0;
    }
}

class FClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int id1 = sc.nextInt();
        String sym1 = sc.next();
        int q1 = sc.nextInt();
        double p1 = sc.nextDouble();

        int id2 = sc.nextInt();
        String sym2 = sc.next();
        int q2 = sc.nextInt();
        double p2 = sc.nextDouble();

        Order eq = new EquityOrder(id1, sym1, q1, p1);
        Order opt = new OptionsOrder(id2, sym2, q2, p2);

        System.out.println("Equity Brokerage: " + eq.calculateBrokerage());
        System.out.println("Options Brokerage: " + opt.calculateBrokerage());
    }
}`,
    testCases: [
      {
        id: 1,
        name: 'Case 1',
        isPublic: true,
        input: '101 RELIANCE 100 2500.0\n102 NIFTY 50 18000.0',
        expectedOutput: 'Equity Brokerage: 125.0\nOptions Brokerage: 20.0',
        weight: 50,
      },
    ],
    solutionVisibility: 'always',
    oppeType: 'oppe1',
    year: '2024',
    term: 'May 2026',
    setName: 'Set 1',
    setProblemNumber: 5,
    tags: ['Inheritance', 'Polymorphism', 'Java'],
  },

  // ---------------------------------------------------------------
  // Problem 6: Doctor and Surgeon - Inheritance
  // ---------------------------------------------------------------
  {
    id: 'java-oppe1-p6',
    title: 'Doctor and Surgeon - Inheritance',
    subject: 'Programming in Java',
    subjectId: 'java',
    week: 'Week 4',
    topic: 'Inheritance & Method Overriding',
    difficulty: 'Medium',
    language: 'java',
    fileName: 'FClass.java',
    description: `A hospital management system maintains records of doctors and surgeons.

Class \`Doctor\` has the following members:
- Instance variables: \`name\` (String), \`specialization\` (String), \`consultationFee\` (double).
- Constructor \`Doctor(String name, String specialization, double consultationFee)\`.
- Method \`calculateTotalFee()\`: returns \`consultationFee\`.

Class \`Surgeon\` extends \`Doctor\`:
- Instance variable: \`surgeryFee\` (double).
- Constructor \`Surgeon(String name, String specialization, double consultationFee, double surgeryFee)\`.
- Overrides \`calculateTotalFee()\`: returns \`consultationFee + surgeryFee\`.`,
    inputFormat: 'Input doctor name, specialization, consultationFee, and surgeryFee.',
    outputFormat: 'Prints total fee for surgeon.',
    constraints: ['Fees are non-negative numbers.'],
    requirements: [
      'Define class Doctor.',
      'Define Surgeon extending Doctor overriding calculateTotalFee().',
    ],
    starterCode: `import java.util.*;

class Doctor {
    protected String name;
    protected String specialization;
    protected double consultationFee;

    public Doctor(String name, String specialization, double consultationFee) {
        this.name = name;
        this.specialization = specialization;
        this.consultationFee = consultationFee;
    }

    public double calculateTotalFee() {
        return consultationFee;
    }
}

class Surgeon extends Doctor {
    private double surgeryFee;

    public Surgeon(String name, String specialization, double consultationFee, double surgeryFee) {
        super(name, specialization, consultationFee);
        this.surgeryFee = surgeryFee;
    }

    @Override
    public double calculateTotalFee() {
        // Write your code here
        return consultationFee + surgeryFee;
    }
}

class FClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        String spec = sc.next();
        double cFee = sc.nextDouble();
        double sFee = sc.nextDouble();

        Doctor doc = new Surgeon(name, spec, cFee, sFee);
        System.out.println("Surgeon Total Fee: " + doc.calculateTotalFee());
    }
}`,
    testCases: [
      {
        id: 1,
        name: 'Case 1',
        isPublic: true,
        input: 'Dr.Sharma Cardiology 1000.0 15000.0',
        expectedOutput: 'Surgeon Total Fee: 16000.0',
        weight: 50,
      },
    ],
    solutionVisibility: 'always',
    oppeType: 'oppe1',
    year: '2024',
    term: 'May 2026',
    setName: 'Set 1',
    setProblemNumber: 6,
    tags: ['Inheritance', 'Polymorphism', 'Java'],
  },

  // ---------------------------------------------------------------
  // Problem 7: Sorting Version Numbers Using Comparable in Java
  // ---------------------------------------------------------------
  {
    id: 'java-oppe1-p7',
    title: 'Sorting Version Numbers Using Comparable in Java',
    subject: 'Programming in Java',
    subjectId: 'java',
    week: 'Week 7',
    topic: 'Comparable & Collections.sort',
    difficulty: 'Medium',
    language: 'java',
    fileName: 'FClass.java',
    description: `A software version management system sorts version numbers. Complete the program to sort an array/list of \`VersionNumber\` objects based on \`major\`, \`minor\`, and \`patch\` version numbers.

Class \`VersionNumber\` implements \`Comparable<VersionNumber>\`:
- Instance variables: \`major\` (int), \`minor\` (int), \`patch\` (int).
- Constructor \`VersionNumber(int major, int minor, int patch)\`.
- Method \`compareTo(VersionNumber other)\`: compares \`major\` version first; if equal, compares \`minor\` version; if equal, compares \`patch\` version.
- Method \`toString()\`: returns \`major.minor.patch\` (e.g. \`1.2.1\`).`,
    inputFormat: 'First line: integer N (number of versions). Next N lines: major minor patch.',
    outputFormat: 'Prints versions in sorted order.',
    constraints: ['1 <= N <= 100.'],
    requirements: [
      'Implement Comparable<VersionNumber> in VersionNumber class.',
      'Implement compareTo method to sort by major, then minor, then patch.',
    ],
    starterCode: `import java.util.*;

class VersionNumber implements Comparable<VersionNumber> {
    private int major;
    private int minor;
    private int patch;

    public VersionNumber(int major, int minor, int patch) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    @Override
    public int compareTo(VersionNumber other) {
        // Write your code here
        if (this.major != other.major) return Integer.compare(this.major, other.major);
        if (this.minor != other.minor) return Integer.compare(this.minor, other.minor);
        return Integer.compare(this.patch, other.patch);
    }

    @Override
    public String toString() {
        return major + "." + minor + "." + patch;
    }
}

class FClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<VersionNumber> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            list.add(new VersionNumber(sc.nextInt(), sc.nextInt(), sc.nextInt()));
        }

        Collections.sort(list);
        for (VersionNumber v : list) {
            System.out.println(v);
        }
    }
}`,
    testCases: [
      {
        id: 1,
        name: 'Case 1',
        isPublic: true,
        input: '3\n2 1 0\n1 9 5\n2 0 4',
        expectedOutput: '1.9.5\n2.0.4\n2.1.0',
        weight: 50,
      },
    ],
    solutionVisibility: 'always',
    oppeType: 'oppe1',
    year: '2024',
    term: 'May 2026',
    setName: 'Set 1',
    setProblemNumber: 7,
    tags: ['Comparable', 'Collections', 'Java'],
  },

  // ---------------------------------------------------------------
  // Problem 8: Sorting Publication Information Using Comparable in Java
  // ---------------------------------------------------------------
  {
    id: 'java-oppe1-p8',
    title: 'Sorting Publication Information Using Comparable in Java',
    subject: 'Programming in Java',
    subjectId: 'java',
    week: 'Week 7',
    topic: 'Comparable & Collections.sort',
    difficulty: 'Medium',
    language: 'java',
    fileName: 'FClass.java',
    description: `A publication database stores paper publication records. Complete the program to sort publication records by \`year\` descending (newer first), and then by \`month\` ascending.

Class \`Publication\` implements \`Comparable<Publication>\`:
- Instance variables: \`title\` (String), \`month\` (int), \`year\` (int).
- Constructor \`Publication(String title, int month, int year)\`.
- Method \`compareTo(Publication other)\`: compares \`year\` descending; if equal, compares \`month\` ascending.`,
    inputFormat: 'First line: integer N. Next N lines: title month year.',
    outputFormat: 'Prints publications in sorted order.',
    constraints: ['1 <= N <= 100.'],
    requirements: [
      'Implement Comparable<Publication> in Publication class.',
      'Override compareTo to sort year descending, then month ascending.',
    ],
    starterCode: `import java.util.*;

class Publication implements Comparable<Publication> {
    private String title;
    private int month;
    private int year;

    public Publication(String title, int month, int year) {
        this.title = title;
        this.month = month;
        this.year = year;
    }

    @Override
    public int compareTo(Publication other) {
        // Write your code here
        if (this.year != other.year) return Integer.compare(other.year, this.year);
        return Integer.compare(this.month, other.month);
    }

    @Override
    public String toString() {
        return title + " (" + month + "/" + year + ")";
    }
}

class FClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<Publication> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            list.add(new Publication(sc.next(), sc.nextInt(), sc.nextInt()));
        }

        Collections.sort(list);
        for (Publication p : list) {
            System.out.println(p);
        }
    }
}`,
    testCases: [
      {
        id: 1,
        name: 'Case 1',
        isPublic: true,
        input: '3\nPaperA 8 2023\nPaperB 3 2024\nPaperC 11 2023',
        expectedOutput: 'PaperB (3/2024)\nPaperA (8/2023)\nPaperC (11/2023)',
        weight: 50,
      },
    ],
    solutionVisibility: 'always',
    oppeType: 'oppe1',
    year: '2024',
    term: 'May 2026',
    setName: 'Set 1',
    setProblemNumber: 8,
    tags: ['Comparable', 'Collections', 'Java'],
  },

  // ---------------------------------------------------------------
  // Problem 9: API Response Status Count Aggregation
  // ---------------------------------------------------------------
  {
    id: 'java-oppe1-p9',
    title: 'API Response Status Count Aggregation',
    subject: 'Programming in Java',
    subjectId: 'java',
    week: 'Week 6',
    topic: 'Map & Data Aggregation',
    difficulty: 'Medium',
    language: 'java',
    fileName: 'FClass.java',
    description: `An API monitoring program tracks HTTP response status codes. Complete the program to process an input list of status codes and calculate the frequency count for each status code.

Define class \`APIResponseStatusCount\`:
- Method \`aggregateStatusCounts(List<Integer> codes)\`: returns a \`Map<Integer, Integer>\` mapping each HTTP status code to its frequency count.`,
    inputFormat: 'First line: integer N. Second line: N space-separated status codes.',
    outputFormat: 'Prints each status code and its count in format \`<code>: <count>\`.',
    constraints: ['Status codes are integers like 200, 404, 500.'],
    requirements: [
      'Implement aggregateStatusCounts method returning Map<Integer, Integer>.',
    ],
    starterCode: `import java.util.*;

class APIResponseStatusCount {
    public static Map<Integer, Integer> aggregateStatusCounts(List<Integer> codes) {
        Map<Integer, Integer> map = new LinkedHashMap<>();
        // Write your code here
        for (int code : codes) {
            map.put(code, map.getOrDefault(code, 0) + 1);
        }
        return map;
    }
}

class FClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<Integer> codes = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            codes.add(sc.nextInt());
        }

        Map<Integer, Integer> result = APIResponseStatusCount.aggregateStatusCounts(codes);
        for (Map.Entry<Integer, Integer> entry : result.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}`,
    testCases: [
      {
        id: 1,
        name: 'Case 1',
        isPublic: true,
        input: '6\n200 404 500 200 200 404',
        expectedOutput: '200: 3\n404: 2\n500: 1',
        weight: 50,
      },
    ],
    solutionVisibility: 'always',
    oppeType: 'oppe1',
    year: '2024',
    term: 'May 2026',
    setName: 'Set 1',
    setProblemNumber: 9,
    tags: ['Map', 'Collections', 'Java'],
  },

  // ---------------------------------------------------------------
  // Problem 10: Employee Portal Support Category Aggregation
  // ---------------------------------------------------------------
  {
    id: 'java-oppe1-p10',
    title: 'Employee Portal Support Category Aggregation',
    subject: 'Programming in Java',
    subjectId: 'java',
    week: 'Week 6',
    topic: 'Map & Data Aggregation',
    difficulty: 'Medium',
    language: 'java',
    fileName: 'FClass.java',
    description: `An IT support portal tracks incoming ticket requests across multiple support categories (e.g. IT, HR, Finance). Write a Java program to calculate the total number of requests for each category.

Define class \`SupportCategoryAggregation\`:
- Method \`aggregateCategories(List<String> categories)\`: returns a \`Map<String, Integer>\` mapping each category to its request count.`,
    inputFormat: 'First line: integer N. Next N lines: category names.',
    outputFormat: 'Prints category name and request count in format \`<category>: <count>\`.',
    constraints: ['1 <= N <= 100.'],
    requirements: [
      'Implement aggregateCategories method returning Map<String, Integer>.',
    ],
    starterCode: `import java.util.*;

class SupportCategoryAggregation {
    public static Map<String, Integer> aggregateCategories(List<String> categories) {
        Map<String, Integer> map = new LinkedHashMap<>();
        // Write your code here
        for (String cat : categories) {
            map.put(cat, map.getOrDefault(cat, 0) + 1);
        }
        return map;
    }
}

class FClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<String> cats = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            cats.add(sc.next());
        }

        Map<String, Integer> result = SupportCategoryAggregation.aggregateCategories(cats);
        for (Map.Entry<String, Integer> entry : result.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}`,
    testCases: [
      {
        id: 1,
        name: 'Case 1',
        isPublic: true,
        input: '5\nIT HR IT Finance IT',
        expectedOutput: 'IT: 3\nHR: 1\nFinance: 1',
        weight: 50,
      },
    ],
    solutionVisibility: 'always',
    oppeType: 'oppe1',
    year: '2024',
    term: 'May 2026',
    setName: 'Set 1',
    setProblemNumber: 10,
    tags: ['Map', 'Collections', 'Java'],
  },
];
