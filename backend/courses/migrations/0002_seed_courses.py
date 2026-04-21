from django.db import migrations


SEED = [
    ("Introduction to Programming", "CSCI 182", "Python basics, control flow, functions"),
    ("Calculus I", "MATH 161", "Limits, derivatives, integrals"),
    ("Physics I", "PHYS 161", "Classical mechanics"),
    ("Data Structures & Algorithms", "CSCI 251", "Lists, trees, graphs, complexity"),
    ("Databases", "CSCI 340", "Relational model, SQL, normalization"),
    ("Web Development", "CSCI 361", "HTML, CSS, JavaScript, REST APIs"),
]


def seed(apps, schema_editor):
    Course = apps.get_model("courses", "Course")
    for name, code, description in SEED:
        Course.objects.get_or_create(
            code=code,
            defaults={"name": name, "description": description},
        )


def unseed(apps, schema_editor):
    Course = apps.get_model("courses", "Course")
    Course.objects.filter(code__in=[c for _, c, _ in SEED]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("courses", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
