import SwiftUI

struct WardrobeView: View {
    @StateObject private var viewModel = WardrobeViewModel()
    @State private var showAddItem = false
    @State private var selectedItem: WardrobeItem?
    @State private var gridColumns = 3

    let columns = [
        GridItem(.flexible(), spacing: 8),
        GridItem(.flexible(), spacing: 8),
        GridItem(.flexible(), spacing: 8)
    ]

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Category Filter
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        CategoryChip(
                            title: "All",
                            isSelected: viewModel.selectedCategory == nil
                        ) {
                            viewModel.setCategory(nil)
                        }

                        ForEach(ClothingCategory.allCases, id: \.self) { category in
                            CategoryChip(
                                title: category.displayName,
                                isSelected: viewModel.selectedCategory == category
                            ) {
                                viewModel.setCategory(category)
                            }
                        }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                }

                // Search and Filter Bar
                HStack {
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.secondary)
                        TextField("Search...", text: $viewModel.searchText)
                            .onChange(of: viewModel.searchText) { _, _ in
                                viewModel.applyFilters()
                            }
                    }
                    .padding(10)
                    .background(Color.gray100)
                    .cornerRadius(10)

                    Button {
                        viewModel.showFavoritesOnly.toggle()
                        viewModel.applyFilters()
                    } label: {
                        Image(systemName: viewModel.showFavoritesOnly ? "heart.fill" : "heart")
                            .foregroundColor(viewModel.showFavoritesOnly ? .red : .secondary)
                    }
                    .padding(10)
                    .background(Color.gray100)
                    .cornerRadius(10)
                }
                .padding(.horizontal)
                .padding(.bottom, 8)

                // Item Count
                HStack {
                    Text("\(viewModel.filteredItems.count) items")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Spacer()
                }
                .padding(.horizontal)

                // Grid
                if viewModel.isLoading && viewModel.items.isEmpty {
                    Spacer()
                    ProgressView()
                    Spacer()
                } else if viewModel.filteredItems.isEmpty {
                    Spacer()
                    VStack(spacing: 16) {
                        Image(systemName: "tshirt")
                            .font(.system(size: 60))
                            .foregroundColor(.gray300)

                        Text("No items found")
                            .font(.headline)
                            .foregroundColor(.secondary)

                        Button("Add Your First Item") {
                            showAddItem = true
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.brandIndigo)
                    }
                    Spacer()
                } else {
                    ScrollView {
                        LazyVGrid(columns: columns, spacing: 8) {
                            ForEach(viewModel.filteredItems) { item in
                                WardrobeGridItem(item: item)
                                    .onTapGesture {
                                        selectedItem = item
                                    }
                            }

                            // Load more indicator
                            if viewModel.hasMorePages {
                                ProgressView()
                                    .frame(maxWidth: .infinity)
                                    .onAppear {
                                        Task {
                                            await viewModel.loadMoreItems()
                                        }
                                    }
                            }
                        }
                        .padding(.horizontal)
                        .padding(.bottom)
                    }
                    .refreshable {
                        await viewModel.refresh()
                    }
                }
            }
            .navigationTitle("Wardrobe")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showAddItem = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showAddItem) {
                AddItemView(viewModel: viewModel)
            }
            .sheet(item: $selectedItem) { item in
                ItemDetailView(item: item, viewModel: viewModel)
            }
        }
    }
}

struct CategoryChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? Color.brandIndigo : Color.gray100)
                .foregroundColor(isSelected ? .white : .primary)
                .cornerRadius(20)
        }
    }
}

struct WardrobeGridItem: View {
    let item: WardrobeItem

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            ZStack(alignment: .topTrailing) {
                AsyncImage(url: URL(string: item.displayImageUrl)) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color.gray100)
                        .overlay {
                            Image(systemName: "photo")
                                .foregroundColor(.gray300)
                        }
                }
                .frame(height: 140)
                .clipShape(RoundedRectangle(cornerRadius: 8))

                if item.isFavorite {
                    Image(systemName: "heart.fill")
                        .foregroundColor(.red)
                        .padding(6)
                        .background(.ultraThinMaterial)
                        .clipShape(Circle())
                        .padding(4)
                }
            }

            Text(item.name ?? item.category.displayName)
                .font(.caption)
                .lineLimit(1)

            if let color = item.primaryColor {
                HStack(spacing: 4) {
                    Circle()
                        .fill(ClothingColor.color(for: color))
                        .frame(width: 10, height: 10)
                    Text(color.capitalized)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
        }
    }
}

struct AddItemView: View {
    @Environment(\.dismiss) var dismiss
    @ObservedObject var viewModel: WardrobeViewModel
    @State private var selectedImage: UIImage?
    @State private var showImagePicker = false
    @State private var showCamera = false
    @State private var isProcessing = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                if let image = selectedImage {
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(maxHeight: 300)
                        .cornerRadius(16)
                        .padding()

                    if isProcessing {
                        HStack {
                            ProgressView()
                            Text("Analyzing item...")
                                .foregroundColor(.secondary)
                        }
                    } else {
                        Button("Add to Wardrobe") {
                            addItem()
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.brandIndigo)
                    }
                } else {
                    Spacer()

                    VStack(spacing: 16) {
                        Image(systemName: "camera.fill")
                            .font(.system(size: 60))
                            .foregroundColor(.brandIndigo)

                        Text("Add a new item")
                            .font(.title2.bold())

                        Text("Take a photo or choose from your gallery")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }

                    Spacer()

                    HStack(spacing: 16) {
                        Button {
                            showCamera = true
                        } label: {
                            Label("Camera", systemImage: "camera")
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.brandIndigo)

                        Button {
                            showImagePicker = true
                        } label: {
                            Label("Gallery", systemImage: "photo")
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.bordered)
                    }
                    .padding()
                }
            }
            .navigationTitle("Add Item")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
            .sheet(isPresented: $showImagePicker) {
                ImagePicker(image: $selectedImage, sourceType: .photoLibrary)
            }
            .sheet(isPresented: $showCamera) {
                ImagePicker(image: $selectedImage, sourceType: .camera)
            }
        }
    }

    private func addItem() {
        guard let image = selectedImage,
              let imageData = image.jpegData(compressionQuality: 0.8) else {
            return
        }

        isProcessing = true

        Task {
            if let _ = await viewModel.addItem(imageData: imageData, metadata: nil) {
                dismiss()
            }
            isProcessing = false
        }
    }
}

struct ItemDetailView: View {
    let item: WardrobeItem
    @ObservedObject var viewModel: WardrobeViewModel
    @Environment(\.dismiss) var dismiss
    @State private var showDeleteAlert = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // Image
                    AsyncImage(url: URL(string: item.displayImageUrl)) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        RoundedRectangle(cornerRadius: 16)
                            .fill(Color.gray100)
                            .frame(height: 300)
                    }
                    .frame(maxHeight: 300)
                    .frame(maxWidth: .infinity)
                    .cornerRadius(16)
                    .padding(.horizontal)

                    // Details
                    VStack(alignment: .leading, spacing: 12) {
                        Text(item.name ?? item.category.displayName)
                            .font(.title2.bold())

                        // Category & Subcategory
                        HStack {
                            Label(item.category.displayName, systemImage: item.category.icon)
                            if let subcategory = item.subcategory {
                                Text("•")
                                Text(subcategory.capitalized)
                            }
                        }
                        .font(.subheadline)
                        .foregroundColor(.secondary)

                        // Colors
                        if let color = item.primaryColor {
                            HStack {
                                Text("Color:")
                                    .foregroundColor(.secondary)
                                Circle()
                                    .fill(ClothingColor.color(for: color))
                                    .frame(width: 20, height: 20)
                                Text(color.capitalized)
                            }
                        }

                        // Brand & Size
                        if let brand = item.brand {
                            HStack {
                                Text("Brand:")
                                    .foregroundColor(.secondary)
                                Text(brand)
                            }
                        }

                        if let size = item.size {
                            HStack {
                                Text("Size:")
                                    .foregroundColor(.secondary)
                                Text(size)
                            }
                        }

                        // Stats
                        Divider()

                        HStack(spacing: 24) {
                            StatItem(value: "\(item.timesWorn)", label: "Times Worn")
                            if let price = item.price {
                                let costPerWear = item.timesWorn > 0 ? price / Double(item.timesWorn) : price
                                StatItem(value: String(format: "$%.2f", costPerWear), label: "Cost/Wear")
                            }
                        }

                        // Occasions
                        if !item.occasions.isEmpty {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Occasions")
                                    .font(.headline)
                                FlowLayout(spacing: 8) {
                                    ForEach(item.occasions, id: \.self) { occasion in
                                        Text(occasion)
                                            .font(.caption)
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 6)
                                            .background(Color.gray100)
                                            .cornerRadius(12)
                                    }
                                }
                            }
                        }

                        // Seasons
                        if !item.season.isEmpty {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Seasons")
                                    .font(.headline)
                                FlowLayout(spacing: 8) {
                                    ForEach(item.season, id: \.self) { season in
                                        Text(season.displayName)
                                            .font(.caption)
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 6)
                                            .background(Color.gray100)
                                            .cornerRadius(12)
                                    }
                                }
                            }
                        }
                    }
                    .padding(.horizontal)

                    // Actions
                    HStack(spacing: 16) {
                        Button {
                            Task {
                                await viewModel.toggleFavorite(id: item.id)
                            }
                        } label: {
                            Label(
                                item.isFavorite ? "Unfavorite" : "Favorite",
                                systemImage: item.isFavorite ? "heart.fill" : "heart"
                            )
                            .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.bordered)

                        Button {
                            Task {
                                await viewModel.markAsWorn(id: item.id)
                            }
                        } label: {
                            Label("Worn Today", systemImage: "checkmark.circle")
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.brandIndigo)
                    }
                    .padding(.horizontal)

                    Button(role: .destructive) {
                        showDeleteAlert = true
                    } label: {
                        Label("Delete Item", systemImage: "trash")
                            .frame(maxWidth: .infinity)
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical)
            }
            .navigationTitle("Item Details")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
            .alert("Delete Item?", isPresented: $showDeleteAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Delete", role: .destructive) {
                    Task {
                        if await viewModel.deleteItem(id: item.id) {
                            dismiss()
                        }
                    }
                }
            } message: {
                Text("This action cannot be undone.")
            }
        }
    }
}

struct StatItem: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title3.bold())
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}

// Flow Layout for tags
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = FlowResult(in: proposal.width ?? 0, subviews: subviews, spacing: spacing)
        return result.size
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = FlowResult(in: bounds.width, subviews: subviews, spacing: spacing)
        for (index, subview) in subviews.enumerated() {
            subview.place(at: CGPoint(x: bounds.minX + result.positions[index].x,
                                       y: bounds.minY + result.positions[index].y),
                          proposal: .unspecified)
        }
    }

    struct FlowResult {
        var size: CGSize = .zero
        var positions: [CGPoint] = []

        init(in maxWidth: CGFloat, subviews: Subviews, spacing: CGFloat) {
            var x: CGFloat = 0
            var y: CGFloat = 0
            var rowHeight: CGFloat = 0

            for subview in subviews {
                let size = subview.sizeThatFits(.unspecified)
                if x + size.width > maxWidth && x > 0 {
                    x = 0
                    y += rowHeight + spacing
                    rowHeight = 0
                }
                positions.append(CGPoint(x: x, y: y))
                rowHeight = max(rowHeight, size.height)
                x += size.width + spacing
            }

            self.size = CGSize(width: maxWidth, height: y + rowHeight)
        }
    }
}

struct ImagePicker: UIViewControllerRepresentable {
    @Binding var image: UIImage?
    let sourceType: UIImagePickerController.SourceType

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = sourceType
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let parent: ImagePicker

        init(_ parent: ImagePicker) {
            self.parent = parent
        }

        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.image = image
            }
            picker.dismiss(animated: true)
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            picker.dismiss(animated: true)
        }
    }
}

#Preview {
    WardrobeView()
}
