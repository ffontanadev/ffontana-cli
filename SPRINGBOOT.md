# Spring Boot Test Generator Guide

## Overview

The `ff springboot` command generates JUnit 5 test files for Spring Boot multi-module Maven projects, following BBVA standards and best practices.

## Features

✅ **JUnit 5** - Modern test framework
✅ **MockMVC** - Controller testing with full HTTP simulation
✅ **Mockito** - Service and DAO mocking
✅ **Multi-Module** - Supports Maven multi-module projects
✅ **BBVA Standards** - Follows BBVA naming conventions

## Quick Start

### Generate Controller Test

```bash
ff springboot generate-test UserController \
  --api-name users-api \
  --package com.bbva.users \
  --type controller \
  --module rest
```

### Generate Service Test

```bash
ff sb gt UserService \
  -a users-api \
  -p com.bbva.users \
  -t service \
  -m service
```

### Generate DAO Test

```bash
ff sb gt UserDAO \
  -a users-api \
  -p com.bbva.users \
  -t dao \
  -m service
```

## Directory Structure

The generator creates tests following this structure:

```
users-api/
├── rest-sb-users/
│   └── src/
│       └── test/
│           └── java/
│               └── com/bbva/users/
│                   └── UserControllerTest.java
│
└── services-users/
    └── src/
        └── test/
            └── java/
                └── com/bbva/users/
                    ├── UserServiceTest.java
                    └── UserDAOTest.java
```

## Command Reference

### `ff springboot generate-test [className]`

Alias: `ff sb gt`

Generate JUnit 5 test file for Spring Boot classes.

**Arguments:**
- `className` - Name of class to test (e.g., UserController)

**Options:**
- `-a, --api-name <name>` - API name (e.g., users-api)
- `-p, --package <package>` - Java base package (e.g., com.bbva.users)
- `-t, --type <type>` - Test type: `controller` | `service` | `dao`
- `-m, --module <module>` - Module type: `rest` | `service` | `dao`
- `-o, --out-dir <dir>` - Custom output directory
- `--debug` - Enable debug mode

## Test Templates

### Controller Test (MockMVC)

Generated controller tests include:

```java
@WebMvcTest(UserController.class)
@DisplayName("UserController Tests")
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    @DisplayName("Get all users - Success")
    public void testGetAllUsers() throws Exception {
        // Given
        List<User> users = Arrays.asList(new User());
        when(userService.findAll()).thenReturn(users);

        // When
        ResultActions result = mockMvc.perform(get("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON));

        // Then
        result.andExpect(status().isOk())
              .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(userService, times(1)).findAll();
    }
}
```

### Service Test (Mockito)

Generated service tests include:

```java
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Tests")
public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Test
    @DisplayName("Find user by ID - Success")
    public void testFindById() {
        // Given
        Long id = 1L;
        User user = new User(id, "John");
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        // When
        Optional<User> result = userService.findById(id);

        // Then
        assertTrue(result.isPresent());
        assertEquals("John", result.get().getName());
    }
}
```

### DAO Test (Mockito)

Generated DAO tests include:

```java
@ExtendWith(MockitoExtension.class)
@DisplayName("UserDAO Tests")
public class UserDAOTest {

    @InjectMocks
    private UserDAO userDAO;

    @Mock
    private UserRepository repository;

    @Test
    @DisplayName("Save user - Success")
    public void testSave() {
        // Given
        User user = new User("John");
        when(repository.save(any(User.class))).thenReturn(user);

        // When
        User result = userDAO.save(user);

        // Then
        assertNotNull(result);
        verify(repository, times(1)).save(any(User.class));
    }
}
```

## Annotations Reference

### Controller Tests
- `@WebMvcTest` - Loads only web layer
- `@MockBean` - Mock Spring beans
- `@Autowired` - Inject MockMvc

### Service/DAO Tests
- `@ExtendWith(MockitoExtension.class)` - Enable Mockito
- `@InjectMocks` - Create instance with mocked dependencies
- `@Mock` - Create mock objects
- `@BeforeEach` - Setup before each test
- `@Test` - Mark test method
- `@DisplayName` - Test description

## Maven Dependencies

Ensure your `pom.xml` includes:

```xml
<dependencies>
    <!-- JUnit 5 -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- Mockito -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- Spring Boot Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Integration with Maven

Run generated tests:

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserControllerTest

# Run tests in specific module
mvn test -pl rest-sb-users

# Run with coverage
mvn test jacoco:report
```

## Best Practices

### 1. Test Naming
- Use `Test` suffix for test classes
- Use descriptive test method names
- Use `@DisplayName` for readable descriptions

### 2. AAA Pattern
- **Arrange** - Set up test data and mocks
- **Act** - Execute the method under test
- **Assert** - Verify the results

### 3. Mocking Strategy
- Mock external dependencies
- Use `@MockBean` for Spring beans
- Use `@Mock` for simple POJOs

### 4. Assertions
- Use specific assertions (`assertEquals`, not just `assertNotNull`)
- Test both success and failure scenarios
- Verify mock interactions with `verify()`

## Advanced Usage

### Custom Output Directory

```bash
ff sb gt UserController \
  -a users-api \
  -p com.bbva.users \
  -t controller \
  -o /custom/path/to/tests
```

### Batch Generation

Create multiple test files:

```bash
# Controllers
for class in UserController ProductController OrderController; do
  ff sb gt $class -a my-api -p com.bbva.myapi -t controller -m rest
done

# Services
for class in UserService ProductService OrderService; do
  ff sb gt $class -a my-api -p com.bbva.myapi -t service -m service
done
```

## BBVA Production Standards

### Naming Conventions
- ✅ Test class: `{ClassName}Test.java`
- ✅ REST module: `rest-sb-{apiname}`
- ✅ Services module: `services-{apiname}`
- ✅ Package: `com.bbva.{domain}`

### Required Test Coverage
- Controllers: All endpoints
- Services: All public methods
- DAOs: CRUD operations
- Target: 80%+ code coverage

### Review Checklist
- [ ] Test class has `@DisplayName`
- [ ] All tests use AAA pattern
- [ ] Mocks are properly configured
- [ ] Assertions are specific
- [ ] Both success and failure cases covered
- [ ] Exceptions are tested
- [ ] Edge cases are handled

## Troubleshooting

### Generated tests don't compile

1. Verify dependencies in `pom.xml`
2. Check package names match your structure
3. Ensure Spring Boot version compatibility

### MockMVC returns 404

1. Verify controller mapping annotations
2. Check `@WebMvcTest` includes correct controller
3. Ensure Spring Security is properly mocked if enabled

### Mocks not working

1. Verify `@MockBean` vs `@Mock` usage
2. Check mock setup uses correct parameter matchers
3. Ensure `when()` statements match actual calls

## Examples

See example test files in `/home/user/ffontana-cli/templates/springboot/`
